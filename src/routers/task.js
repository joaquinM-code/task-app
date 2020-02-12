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
///FETCHING TASK BY COMPLETED OR INCOPLETED//////
//GET /task?completed=true or flase

///FETCHING TASK WITH PAGINATION//////
//GET /task?limit=integer&skip=integer
//skip tells me wich set o results I get, for example if a I limit to 10 and skip=10 I get the second 10 matches

///FETCHING TASK AND SORTING BY DATE OF CREATION ASCENDING AND DESCENDING//////
//GET /tasks?sortBy=createdAt:asc OR //GET /tasks?sortBy=createdAt:desc

router.get('/tasks' , auth , async(req , res)=>{
    const match = {};
    const sort = {};
    if(req.query.completed){
        match.completed = req.query.completed === 'true';
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1]==='desc'? -1 : 1;
    }

    
    try{
        //Customize populate to receive url parameters
        await req.user.populate({
            path : 'tasks',//Tells populate to match the tasks parameter
            match,
            options:{
                limit: parseInt(req.query.limit),//if no number provided limit = undefined , so no limit
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        res.send(req.user.tasks);
    }catch(error){
        res.status(500).send();
    }
})

//Reading one task by id
router.get('/tasks/:id' , auth , async(req , res)=>{
    const _id = req.params.id;
    
    try{
        //Fetch task by id and user id so only the creator can find his tasks
        const task = await Task.findOne({_id , owner: req.user._id});

        if(!task){
            return res.status(404).send();
        }
        res.send(task);
    }catch(error){
        res.status(500).send()
    }
})

//Updating task by id
router.patch('/tasks/:id' , auth,  async (req , res )=>{
    const _id = req.params.id;
    
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description' , 'completed'];
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidUpdate){
        return res.status(400).send({error: "Not a valid update"});
    }

    try{

        const task = await Task.findOne({_id , owner : req.user._id});

        if(!task){
            return res.status(404).send();
        }
        updates.forEach((update)=>task[update] = req.body[update]);
        await task.save();
        res.send(task);

    }catch(error){
        res.status(400).send(error.message);
    }
})


//delete task by id
router.delete('/tasks/:id' , auth , async (req , res)=>{
    const _id = req.params.id;
    try{
        const task = await Task.findOneAndDelete({_id , owner: req.user._id});
        if(!task){
            return res.status(404).send();
        }
        res.send(task);
    }catch(error){
        res.status(500).send(error.name);
    }
})

module.exports = router;