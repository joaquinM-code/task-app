const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENGRID_API_KEY);

const sendWelcomeEmail = (email , name)=>{
    sgMail.send({
        to: email,
        from: 'welcome@myserver.com',
        subject: 'Thak you for joining in!',
        text:`Welcome to the app, ${name} , Let us know if you like it!`,
        //html: '<h1>Welcome...' html can be used to send the email
    })
//This function returns a promise, so it can be set up with async await(not necesary because we don't want a response from the server)
}

const sendCancelationEmail = (email , name)=>{
    sgMail.send({
        to: email,
        from: 'Bye@myserver.com',
        subject: 'Sorry to see you go!',
        text: `Hi ${name}, 
        We are sorry to see you go, send us feedback to this address so we can improve and maybe see you in the future.
        See you soon!`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}
