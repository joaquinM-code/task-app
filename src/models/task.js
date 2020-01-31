const mongoose = require('mongoose');

const Task = mongoose.model('Task' , {
    description:{
        type: String,
        required: true,
        trim: true
    },
    completed:{
        type: Boolean,
        default: false
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        //ref set up the relationship between the task and User documents in mongodb
        ref: 'User'
    }
});

module.exports = Task;