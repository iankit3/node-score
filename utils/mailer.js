const password = require("../password");
const nodemailer = require('nodemailer');
// create reusable transporter object using the default SMTP transport

if(process.env.NODE_ENV == "production"){
  password = {mail:process.env.mail}
}

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
        user: 'mailme.nodemailer@gmail.com',
        pass: password.mail
    }
});

/*
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
  });
*/

function sendEmail(options, callback) {
    transporter.sendMail(options, (error, info) => {
        if (error) return console.log(error);

        callback(info);
    })
}

module.exports = {
    mailer: {
        sendMail: (options, callback) => {
            sendEmail(options, callback)
        }
    }
}
