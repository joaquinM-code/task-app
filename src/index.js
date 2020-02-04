const express = require('express');
require('./db/mongoose.js');
const taskRouter = require('./routers/task');
const userRouter = require('./routers/user');


//Seting server
const app = express();
const port = process.env.PORT;




//Seting up middleware
//We declare the function, unlike the next app.use is not express native
// Here we set up a function that runs in every request and path
//Is very usefull to validate authenticated users

///Creating a maintenance mode usig middleware, coment when finish
// app.use((req, res, next)=>{
//     res.status(503).send('The server is under maintenance, please try again latter');
// })

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


