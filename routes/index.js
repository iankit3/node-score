var express = require('express');
var router = express.Router();
var db = require('../database/database');
const jwt = require("jsonwebtoken");
const mailer = require("../utils/mailer").mailer;

router.get("/magic", (req, res) => {
    var token = req.param.token;
    var email;
    jwt.verify(req.query.token, 'lovely secret', (err, decoded) => {
        email = decoded.email;
        
        res.cookie("token_email",email);
         var cookie_email = req.cookies.token_email;
         var google_email = req.cookies.google_email;
  
        if(cookie_email == google_email) res.sendFile('/public/partials/test.html');

    })

})

router.get("/myuser", (req, res) => {
  var email = jwt.verify(req.query.token, 'lovely secret', (err, decoded) => {
    console.log(decoded);
  })

  var cookie_email = req.cookies.token_email;
  var google_email = req.cookies.google_email;

      //  var q = "SELECT * from interviewees WHERE email=" + email;
      //   console.log("Q : " + q);
      //   var result = db.executeQuery(q);
  res.end("TREY");
  //if(cookie_email == google_email) res.sendFile('/public/partials/test.html');

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