const mongoose = require('mongoose');


mongoose.connect('mongodb://127.0.0.1:27017/tasks-manager-api' , {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex: true
});

const User = mongoose.model('User', {
    name: {
        type: String
    },
    age: {
        type: Number
    }
});

const Task = mongoose.model('Task' , {
    description:{
        type: String
    },
    completed:{
        type: Boolean
    }
});


// const me = new User({
//     name: 'Sandra',
//     age: 45
// });

// me.save().then(()=>{
//     console.log(me);
// }).catch((error)=>{
//     console.log(error);
// });

const task = new Task({
    description: "Wash car",
    completed:true
})

task.save().then(()=>{
    console.log(task);
}).catch((error)=>{
    console.log(error);
});