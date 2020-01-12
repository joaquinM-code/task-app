// CRUD operations (Create, Read, Update and Delete)
const {MongoClient , ObjectID}=require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

MongoClient.connect(connectionURL, { useNewUrlParser: true , useUnifiedTopology:true} , (error , client)=>{
    if(error){
        return console.log('Unable to connect the database');
    };

   const db = client.db(databaseName);
    

    //INSERTING DATA/////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////INSERT ONE USER/////////////////////////////////////////////////////////////////
    // db.collection('users').insertOne({
    //     name: "Marina",
    //     age: 33
    // }).then((result)=>{
    //     console.log(result.ops);
    // }).catch((error)=>{
    //     console.log(error);
    // });
    /////////////////////////////////////////////////////////////////INSERT SEVERAL USERS/////////////////////////////////////////////////////////////////
    // db.collection('users').insertMany([
    //     {
    //         name:"Jane", 
    //         age:22
    //     }, {
    //         name:"Joey",
    //         age:35
    //     };
    // ], (error , result)=>{
    //     if(error){
    //         return console.log("Unable to insert documents");
    //     }
    //     console.log(result.ops);
    // });

    /////READING DATA/////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////FIND FIRST OCCURRENCE/////////////////////////////////////////////////////////////////
    //     db.collection('users').findOne({name:"Jane"}, (error , user)=>{
    //         if(error){
    //             return console.log("Unable to find user");
    //         }
    //         console.log(user.name , user.age);
    //     })

    //     db.collection('tasks').findOne({_id: new ObjectID("5e15f9b1ef43772780c67a53")}, (error , task)=>{
    //         if(error){
    //             return console.log("Unable to find user");
    //         }
    //         console.log(task);
    //     });
    ///////////////////////////////////////////////////////////////////FIND ALL OCCURRENCES/////////////////////////////////////////////////////////////////
    //     db.collection('users').find({age:32}).toArray((error , users)=>{
    //         if(error){
    //             return console.log("Unable to find user");
    //         }
    //         console.log(users);
    //     });
    //     db.collection('users').find({age:32}).count((error , count)=>{
    //         if(error){
    //             return console.log("Unable to find user");
    //         }
    //         console.log(count);
    //     });
    //     db.collection('tasks').find({completed:false}).toArray((error , tasks)=>{
    //         if(error){
    //             return console.log("Unable to find user");
    //         }
    //         console.log(tasks);
    //     }); 
    /////UPDATE DATA//////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////UPDATE ONE /////////////////////////////////////////////////////////////////
    //     db.collection('users').updateOne({
    //         _id: new ObjectID("5e174eb961ef6a026c8023ca")
    //     } , {
    //         $set:{
    //             age:30
    //         }
    //     }).then((result)=>{
    //         console.log(result.modifiedCount);
    //     }).catch((error)=>{
    //         console.log(error);
    //     });
    // ////////////////////////////////////////////////////////////////////UPDATE MANY /////////////////////////////////////////////////////////////////
    //     db.collection('tasks').updateMany({
    //         completed:false
    //     },{
    //         $set:{
    //             completed:true
    //         }
    //     }).then((result)=>{
    //         console.log(result.modifiedCount);
    //     }).catch((error)=>{
    //         console.log(error);
    //     });
    //   
    /////DELETE DATA//////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////DELETE MANY /////////////////////////////////////////////////////////////////

    //     db.collection('users').deleteMany({
    //         age:35
    //     }).then((result)=>{
    //         console.log(result.deletedCount);
    //     }).catch((error=>{
    //         console.log(error);
    //     }));
    // ////////////////////////////////////////////////////////////////////DELETE ONE /////////////////////////////////////////////////////////////////

    //     db.collection('tasks').deleteOne({
    //         description:"Wash dishes"
    //     }).then((result)=>{
    //         console.log(result.deletedCount);
    //     }).catch((error)=>{
    //         console.log('error');
    //     });


});