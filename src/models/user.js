const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

//Creating an schema allows me to proces the data beefore is saved
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        unique:true,
        required: true,
        trim: true
    },
    email:{
        type: String,
        unique:true,
        required: true,
        trim:true,
        lowercase:true,
        validate(value){
            if (!validator.isEmail(value)){
                throw new Error('Email is invalid');
            };
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if(value < 0){
                throw new Error('Age must be a positive number');
            };
        }
    },
    password:{
         type: String,
         required:true,
         minlength: 7,
         trim: true,
         validate(value){
             if(value.toLowerCase().includes("password")){
                 throw new Error('The word "password" in not accepted');
             };
         }
    },
    tokens:[{
        token:{
            type: String,
            required: true,
        }
    }],
    avatar:{
        type: Buffer
    }
} ,{
    timestamps : true//set timestamp in the DB
})
//Setting a virtual model to asociate the tasks with the user
//Virtual relationships are not stored in the DB are used by mongoose to retrive the data when is neded and return an array of the retreived data
    userSchema.virtual('tasks', {
        //The keys on the lines beelow must be litteral in order to work
        ref: 'Task',
        localField:'_id',
        foreignField:'owner'
    })






//By setting up a value for methods latter we can access it calling nameOfInstance.nameOfTheValue methods are accesible in the instances of the model
userSchema.methods.generateAuthToken = async function(){
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() } , process.env.JWT_SECRET);

    user.tokens = user.tokens.concat({token});
    await user.save();

    return token;
}

//Creating function to send only public profile back to users
//We are refactoting toJSON method so it deletes every sensible data(see playground)
userSchema.methods.toJSON = function(){
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    delete userObject._id;
    delete userObject.__v;
    delete userObject.avatar;

    return userObject;
}


//By setting up a value for statics latter we can access it calling User.nameOfTheValue static methods are accesible in the model
userSchema.statics.findByCredentials = async (email , password)=>{
    
    const user = await User.findOne({email});
    if(!user){
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password , user.password);
    if(!isMatch){
        throw new Error('Unable to login');
    }

    return user;
} 


//Middleware to acces the schema an operating before is saved 
userSchema.pre('save' , async function(next){
    const user = this;

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password , 8);  
    }


    next();//ends middleware execution and allow the rest of route the code to continue
})

//Middleware to delete user tasks if user is removed
userSchema.pre('remove' , async function(next){
    const user = this;
    await Task.deleteMany({ owner : user._id});
    next();
})

//Creates the user model
const User = mongoose.model('User', userSchema);

module.exports = User;