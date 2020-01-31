const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const router = new express.Router();

//Creating task
router.post('/tasks' , auth , async(req , res)=>{

    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try{
        await task.save();
        res.status(201).send(task);
    }catch(error){
        res.status(400).send();
    }
    // task.save().then(()=>{   ////////try catch method/////
    //     res.status(201).send(task);
    // }).catch((error)=>{
    //     res.status(400).send(error);
    // })
})

//Reading all tasks
router.get('/tasks' , async(req , res)=>{
    
    try{
        const tasks = await Task.find({});
        res.send(tasks);
    }catch(error){
        res.status(500).send();
    }
})

//Reading one task by id
router.get('/tasks/:id' , async(req , res)=>{
    const _id = req.params.id;
    
    try{
        const task = await Task.findById(_id);
        if(!task){
            return res.status(404).send();
        }
        res.send(task);
    }catch(error){
        res.status(500).send()
    }
})

//Updating task by id
router.patch('/tasks/:id' , async (req , res )=>{
    const _id = req.params.id;
    
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description' , 'completed'];
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidUpdate){
        return res.status(400).send({error: "Not a valid update"});
    }

    try{

        const task = await Task.findById(_id);
        updates.forEach((update)=>task[update] = req.body[update]);
        await task.save();

        //const task = await Task.findByIdAndUpdate(_id , req.body , {new:true , runValidators:true});
        if(!task){
            return res.status(404).send();
        }
        res.send(task);

    }catch(error){
        res.status(400).send(error.message);
    }
})


//delete task by id
router.delete('/tasks/:id' , async (req , res)=>{
    const _id = req.params.id;
    try{
        const task = await Task.findByIdAndDelete(_id);
        if(!task){
            return res.status(404).send();
        }
        res.send(task);
    }catch(error){
        req.status(500).send(error.name);
    }
})

module.exports = router;