const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/user');
const auth = require('../middleware/auth');
const {sendWelcomeEmail , sendCancelationEmail} = require('../emails/account'); 
const router = new express.Router();


//Creating user
router.post('/users' , async (req , res)=>{
    const user = new User(req.body);
    try{
        await user.save();
        sendWelcomeEmail(user.email , user.name);
        
        const token = await user.generateAuthToken();
        res.status(201).send({user , token});//only runs if the await is fullfiled else the catch trigers
    }catch(error){
        res.status(400).send(error);
    }
})

//Reading my user
//To add middleware to a single route we pass it as argument
//When someone passes a request to /users/me, first will run the middleware and if it calls next the rest of the function will run
//The user has already been fetched using the middleware so we only send the authenticated user info
router.get('/users/me' , auth , async(req , res)=>{
  res.send(req.user);
})

//Logging in Users
router.post('/users/login' , async (req , res)=>{
    try{
        const user = await User.findByCredentials(req.body.email , req.body.password);//see user model statics.findByCredentials
        const token = await user.generateAuthToken();//see user model methods
        res.send({user , token});
    }catch(error){
        res.status(400).send();
    }
})

//Logging out users in one device

router.post('/users/logout' , auth , async (req , res)=>{
    try{
        //Filter the array of tokens removing the provided one
        req.user.tokens = req.user.tokens.filter((token)=> token.token !== req.token);
        await req.user.save();
        res.send();
    }catch(error){
        res.status(500).save();
    }
})

//Login out user from all devices (cleaning all tokens)

router.post('/users/logoutAll' , auth , async (req , res)=>{
    try{
        req.user.tokens = [];
        await req.user.save();
        res.send();
    }catch(error){
        res.status(500).save(error);
    }
})

//Updating my user
router.patch('/users/me', auth , async (req, res)=>{
    

    //Validating if the parameters sended are valid updates
    const updates = Object.keys(req.body);
    const allowedToUpdates= ['name' , 'email' , 'password' , 'age'];
    const isValidUpdate = updates.every((update)=>allowedToUpdates.includes(update));

    if(!isValidUpdate){
        return res.status(400).send({error: "Not a valid update"})
    }

    try{
        //Changing the parameters requested in the body
        const user = req.user;
        updates.forEach((update)=>user[update] = req.body[update]);
        await user.save();
        res.status(202).send({user , message: "User updated successfully"});

    }catch(error){

        res.status(400).send(error.name);
    }
})

//delete my user
router.delete('/users/me' , auth , async (req , res)=>{
    try{
        sendCancelationEmail(req.user.email , req.user.name);
        await req.user.remove()//https://mongoosejs.com/docs/api.html#model_Model.remove
        res.send({user: req.user, message:"User deleted succesfully"});
    }catch(error){
        req.status(500).send();
    }
})


//Upload Avatar picture
const upload = multer({
    //dest: 'avatars', if uncoment will save the files locally if commented we can access the file data in the route handler
    limits:{
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        //Validating file extension
        if(!file.originalname.match(/\.(jpg|png|jpeg)$/)){
            return cb(new Error('Please upload only images'));
        }
        cb(undefined , true);
    }
});

router.post('/users/me/avatar', auth ,  upload.single('avatar') , async (req , res)=>{
        //req.file has all the file information
        //We store it as buffer base64(to load it in html use <img src="data:image/jpg;base64 , binary information>)

        //We use sharp to resize the image (normally is better to do it in the FE ) and convert it to png
        const buffer = await sharp(req.file.buffer).resize({width:250 , height:250}).png().toBuffer();
        req.user.avatar = buffer;

        await req.user.save();
        res.send(); 
}, (error , req ,res , next)=>{ //Middleware error handling , it must have the 4 parameter to let know express that is a handler
    
    res.status(400).send({error: error.message})
})


//Delete avatar image
router.delete('/users/me/avatar' , auth , async (req, res)=>{
   try{
        req.user.avatar = undefined;
        await req.user.save();
        res.send()
   }catch(error){
        res.status(500).send();
   }
    
})

//Fetching avatar by user name

router.get('/users/:name/avatar' , async(req,res)=>{
    try{
        const user = await User.findOne({name:req.params.name});
        if(!user || !user.avatar){
            throw new Error();
        }
        //Setting the response header to image
        res.set('Content-Type' , 'image/png');
        res.send(user.avatar);

    }catch(error){
        res.status(404).send();
    }
} )

module.exports = router;