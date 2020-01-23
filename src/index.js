const express = require('express');
require('./db/mongoose.js');
const taskRouter = require('./routers/task');
const userRouter = require('./routers/user');

//Seting server
const app = express();
const port = process.env.PORT || 3000;

//preparing express to recieve json an parsing it
app.use(express.json());

//Importing User routes
app.use(userRouter);

//Importing Task routes
app.use(taskRouter);

//Set server to listen
app.listen(port , ()=>{
    console.log('Server is up on port '+port);
})


