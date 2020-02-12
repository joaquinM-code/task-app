const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const { userOneId , userOne , setupDatabase} = require('./fixtures/db');


//Function to run before each test that way preventing the database from filling with data
//or the test failing because of duplicate entries
beforeEach(setupDatabase);

// afterEach(()=>{
//     console.log('after')
// })


test('Should sign up a new user' , async()=>{
    const response = await request(app).post('/users').send({
        name: 'Joaquin',
        email: 'test@gmail.com',
        password: '123456789'
    }).expect(201)

    //Testing if the user is in the database
    //response contains all the data from the response body

    const user = await User.findOne({name:response.body.user.name})
    expect(user).not.toBeNull()

    //Assertions about the response body
    expect(response.body).toMatchObject({
        user : {
            name: 'Joaquin',
            email: 'test@gmail.com'
        },
        token: user.tokens[0].token
    })

    //Assertion about user password hash
    expect(user.password).not.toBe('123456789')

})

test('should an existing user login' , async ()=>{
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)


    //Assertion about new token saved in the database
    const user  = await User.findOne({name: response.body.user.name});
    expect(user.tokens[1].token).toBe(response.body.token);
})

test(' Should not signup user with invalid name/email/password' , async ()=>{
    await request(app)
        .post('/users/login')
        .send({
            email:userOne.email,
            password: '1234rte'
        })
        .expect(400)
})


test('Shold a nonexistent user login' , async ()=>{
    await request(app).post('/users/login').send({
        email:"forgedemail@SpeechGrammarList.com",
        password:"' or 1=1--"
    }).expect(400)
})


test('Should get profile for user' , async ()=>{
    await request(app)
        .get('/users/me')
        .set('Authorization' , `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
})

test('Should not get profile for unauthenticated user' , async ()=>{
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})


test('Should delete account for user' , async ()=>{
    const response = await request(app)
        .delete('/users/me')
        .set('Authorization' , `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    //Assertion about user deleted in the database
    const user = await User.findOne({name: response.body.user.name});
    expect(user).toBeNull()

})

test('Shoul not delete unauthenticated user' , async ()=>{
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})


test('Should upload avatar image', async ()=>{
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization' , `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar' , 'tests/fixtures/img.jpg')
        .expect(200);

    const user = await User.findById(userOneId);
    expect(user.avatar).toEqual(expect.any(Buffer));

})

test('Should update valid user fields' , async ()=>{
    await request(app)
        .patch('/users/me')
        .set('Authorization' , `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Peter',
            email: 'newemail@test.com'
        })
        .expect(202)
    const user = await User.findById(userOneId);
    expect(user.name).toBe('Peter');
})

test('Should not update invalid fields' , async ()=>{
    await request(app)
        .patch('/users/me')
        .set('Authorization' , `Bearer ${userOne.tokens[0].token}`)
        .send({
            last_name:'Johanson',
            mark: 2
        })
        .expect(400);
})

test('Should not update user if unauthenticated' , async ()=>{
    await request(app)
        .patch('/users/me')
        .send({
            name:'Peter'
        })
        .expect(401)
})

test('Should not update user with invalid name/email/password' , async ()=>{
    await request(app)
    .patch('/users/me')
    .set('Authorization' , `Bearer ${userOne.tokens[0].token}`)
    .send({
        password: 'pass'
    })
    .expect(400);
})