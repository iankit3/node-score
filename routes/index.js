var express = require('express');
var router = express.Router();
var db = require('../database/database');
const jwt = require("jsonwebtoken");
const mailer = require("../utils/mailer").mailer;

// app.get('/some_path',checkAuthentication,function(req,res){
//     //do something only if user is authenticated
// });

function checkAuthentication(req,res,next){
    if( (req.isAuthenticated()) &&
         (req.cookies.token_email == req.cookies.google_email)){
        //if user is looged in, req.isAuthenticated() will return true 
        next();
    } else{
        res.redirect("/login");
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
  
        res.redirect("/api/test");

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
            <button><a href="http:127.0.0.1:9999/api/magic?token=${token}">Click</a></button>    
          ` // html body
  };

  mailer.sendMail(mailOptions,function(info){
      console.log("Mail sent");
      console.log(info);
  })
})

module.exports = router;