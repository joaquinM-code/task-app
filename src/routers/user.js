const express = require('express');
const User = require('../models/user')
const router = new express.Router();

//Creating user
router.post('/users' , async (req , res)=>{
    const user = new User(req.body);
    try{
        await user.save();
        res.status(201).send(user);//only runs if the await is fullfiled else the catch trigers
    }catch(error){
        res.status(400).send();
    }
})

//Reading all users
router.get('/users' , async(req , res)=>{

    try{
        const users = await User.find({});
        res.send(users)
    }catch(error){
        res.status(500).send();
    }   
})

//Reading one user by id
router.get('/users/:id' , async(req , res)=>{
    //:id give us access to a dinamic parameter through req.params
    const _id = req.params.id;

    try{
        const user = await User.findById(_id);
        if(!user){
            return res.status(404).send();
        }
        res.send(user);
    }catch(error){
        res.status(500).send();
    }

})

//Updating users by id
router.patch('/users/:id', async (req, res)=>{
    const _id = req.params.id;

    const updates = Object.keys(req.body);
    const allowedToUpdates= ['name' , 'email' , 'password' , 'age'];
    const isValidUpdate = updates.every((update)=>allowedToUpdates.includes(update));

    if(!isValidUpdate){
        return res.status(400).send({error: "Not a valid update"})
    }

    try{
        const user = await User.findById(_id);

        updates.forEach((update)=>user[update] = req.body[update]);
        await user.save();

        //const user = await User.findByIdAndUpdate(_id ,  req.body , {new: true, runValidators: true});
        if(!user){
            return res.status(404).send();
        }
        res.status(202).send(user);
    }catch(error){

        res.status(400).send(error.name);
    }
})

//delete user by id
router.delete('/users/:id' , async (req , res)=>{
    const _id = req.params.id;
    try{
        const user = await User.findByIdAndDelete(_id);
        if(!user){
            return res.status(404).send();
        }
        res.send(user);
    }catch(error){
        req.status(500).send(error.name);
    }
})

module.exports = router;