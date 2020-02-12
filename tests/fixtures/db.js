/// Contains the necesary code to set up the DataBase
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../src/models/user');
const Task = require('../../src/models/task');


//Dummy users 
const userOneId = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneId,
    name: 'Mike',
    email: 'test1@gmail.com',
    password: '123456789',
    tokens:[{
        token: jwt.sign({_id: userOneId} , process.env.JWT_SECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
    _id: userTwoId,
    name: 'James',
    email: 'johan@gmail.com',
    password: '123456789wer',
    tokens:[{
        token: jwt.sign({_id: userTwoId} , process.env.JWT_SECRET)
    }]
}


const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description : 'Dummy task',
    completed : false,
    owner : userOneId
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description : 'Dummy task 2',
    completed : false,
    owner : userOneId
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description : 'Dummy task 3',
    completed : true,
    owner : userTwoId
}


const setupDatabase = async ()=>{
    //deleting all users and tasks before any operation is done 
    await User.deleteMany();
    await Task.deleteMany();

    //Saving dummy users and tasks
    await new User(userOne).save();
    await new User(userTwo).save();
    await new Task(taskOne).save();
    await new Task(taskTwo).save();
    await new Task(taskThree).save();
}

module.exports = {
    userOneId,
    userOne,
    userTwo,
    userTwoId,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase
}