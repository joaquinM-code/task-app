const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const router = new express.Router();

//Creating user
router.post('/users' , async (req , res)=>{
    const user = new User(req.body);
    try{
        const token = await user.generateAuthToken();
        await user.save();
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

//delete user by id
router.delete('/users/me' , auth , async (req , res)=>{
    try{
        await req.user.remove()//https://mongoosejs.com/docs/api.html#model_Model.remove
        res.send({user: req.user, message:"User deleted succesfully"});
    }catch(error){
        req.status(500).send(error.name);
    }
})



module.exports = router;