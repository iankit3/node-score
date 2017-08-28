var express = require('express');
var router = express.Router();
var db = require('../database/database');
const jwt = require("jsonwebtoken");
const mailer = require("../utils/mailer").mailer;

/*Require for a Senseforth api*/
const nodemailer = require('nodemailer');


// app.get('/some_path',checkAuthentication,function(req,res){
//     //do something only if user is authenticated
// });

function checkAuthentication(req,res,next){
  console.log(`
    req.isAuthenticated() : ${req.isAuthenticated()} \n
    areCookiesEqual = ${req.cookies.token_email == req.cookies.google_email}
  `);
  console.log(`
      ${JSON.stringify(req.user)}
    `)
    if( (req.isAuthenticated()) &&
         (req.cookies.token_email == req.cookies.google_email)){
        //if user is looged in, req.isAuthenticated() will return true 
        next();
    } else{
        res.redirect("/");
    }
}

router.get("/magic", (req, res) => {
    var token = req.param.token;
    var email;
    jwt.verify(req.query.token, 'lovely secret', (err, decoded) => {
        email = decodeURIComponent(decoded.email);
        console.log(`Decoded EMAIL ${email}`)
        res.cookie("token_email",email);
         var cookie_email = req.cookies.token_email;
         var google_email = req.cookies.google_email;
  
        res.redirect("/");

    })

})

// router.get("/myuser", (req, res) => {
//     res.redirect() 
// })

router.get('/test',checkAuthentication, (req,res) => {
    res.send("Authenticated USER" + req.cookies.google_email)
})

router.post("/login", (req, res) => {
  console.log(JSON.stringify(req.body));
})

router.post("/adduser", (req, res) => {
  var email = req.body.email;
  var token = jwt.sign({ email: email }, 'lovely secret');

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"AK 👻" <mailme.nodemailer@gmail.com>', // sender address
    to: email, // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hi', // plain text body
    html: `<b>Hi</b> <br><i>Your token is : ' ${token} '</i>
            <a href="https://mailatnodemailer.herokuapp.com/api/magic?token=${token}">Click</a>
          ` // html body
  };

  mailer.sendMail(mailOptions,function(info){
      console.log("Mail sent");
      console.log(info);
  })
})

/******--------------For Senseforth-----------------*******/
var SF_transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
        user: "sftestingrealtime@gmail.com",
        pass: "senseforth@2012"
    }
});

function SF_sendEmail(options, callback) {
    SF_transporter.sendMail(options, (error, info) => {
        if (error) return console.log(error);

        callback(info);
    })
}
var cuxEmail = "shivang@senseforth.com, nrithya@senseforth.com, sakshi@senseforth.com, saee@senseforth.com, anuja@senseforth.com";
var suryEmail = "Suryaprakash@senseforth.com"; 
var numMapping = {
    "1": "Missing - not added",
    "2": "Missing",
    "3": "Wrong Disamb",
    "4": "Wrong Answer",
    "5": "No Disamb",
    "6": "Context Issue",
    "7": "Spelling Correction",
    "8": "Rephrase Query",
    "9": "Missing Variation",
    "10": "Disamb"
};

var mapping = { 
	"1": cuxEmail,
	"2": cuxEmail,
	"3": suryEmail,
	"4": cuxEmail,
	"5": suryEmail,
	"6": suryEmail,
	"7": suryEmail,
	"8": cuxEmail,
	"9": cuxEmail,
	"10": suryEmail
}

router.post("/sendemail", (req, res) => {
  var ques = req.body.currentQues;
  var option = req.body.selectedOption;

  var emails = mapping[option];
 

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Senseforth_HDFC_FAQ 👻" <sftestingrealtime@gmail.com>', // sender address
    to: emails, // list of receivers
    subject: 'HDFC EVA Issue(Autogen)'+numMapping[option]+'✔', // Subject line
    text: 'Hi', // plain text body
    html: `
                      
           <div>Issue ${numMapping[option]} raised for ques <b>${ques}</b><br></div>
      
           <i>Thank You</i>

          ` // html body
  };

 SF_sendEmail(mailOptions,function(info){
      console.log("Sensforth Mail sent");
      console.log(info);
  })
})

module.exports = router;
