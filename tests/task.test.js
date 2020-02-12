const request = require('supertest');
const Task = require('../src/models/task');
const app = require('../src/app');
const { taskOne,
    taskTwo,
    taskThree, 
    userTwo,
    userTwoId, 
    userOne,
    userOneId, 
    setupDatabase} = require('./fixtures/db');


//Function to run before each test that way preventing the database from filling with data
//or the test failing because of duplicate entries
beforeEach(setupDatabase);

test('Should create task fore user' , async ()=>{
    const response = await request(app)
        .post('/tasks')
        .set('Authorization' , `Bearer ${userOne.tokens[0].token}`)
        .send({
            description : 'From test'
        })
        .expect(201)
    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();
    expect(task.completed).toEqual(false);
})


//Request tasks for user
test('Should return only tasks for given user' , async ()=>{
    const response = await request(app)
        .get('/tasks')
        .set('Authorization' , `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    expect(response.body.length).toEqual(2)
})

test('Should not delete not owned tasks' , async ()=>{
    const response = await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization' , `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)
    const task = await Task.findById(taskOne._id);
    expect(task).not.toBeNull();
})