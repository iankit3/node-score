const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const password = require("./password")
var db = require('./database/database');
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // secure:true for port 465, secure:false for port 587
  auth: {
    user: 'mailme.nodemailer@gmail.com',
    pass: password.mail
  }
});


var authConfig = require('./config/auth'),
  cookieParser = require("cookie-parser"),
  session = require('express-session'),
  passport = require('passport'),
  GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});
passport.use(new GoogleStrategy(
  authConfig.google,
  function (accessToken, refreshToken, profile, done) {
    console.log(profile.emails[0].value);
    return done(null, profile);
  }
));

app.use(cookieParser());
app.use(session({ secret: 'node man', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/partials/index.html")
})
app.get("/magic", (req, res) => {
  var token = res.body.token;
  var email = decrypt(token);
  var q = "SELECT * from interviewees WHERE email=" + email;

  if (db.executeQuery(q).rows, length > 1) res.sendFile('/test.html');
  else res.sendFile('404.html');
})

app.get('/auth/google', passport.authenticate('google', { scope: ['openid', 'email', 'profile'] }));
app.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login'
  }),
  function (req, res) {
    res.redirect('http://iankit3.github.io');
  });
// send to google to do the authentication
app.get('/connect/google', passport.authorize('google', { scope: ['profile', 'email'] }));

// the callback after google has authorized the user
app.get('/connect/google/callback',
  passport.authorize('google', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));

app.get("/myuser", (req, res) => {
  var email = jwt.verify(req.query.token, 'lovely secret', (err, decoded) => {
    console.log(decoded);
  })
})

app.post("/login", (req, res) => {
  console.log(JSON.stringify(req.body));
})

app.post("/adduser", (req, res) => {
  var email = req.body.email;
  var token = jwt.sign({ email: email }, 'lovely secret');


  // setup email data with unicode symbols
  let mailOptions = {
    from: '"AK 👻" <mailme.nodemailer@gmail.com>', // sender address
    to: email, // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hi', // plain text body
    html: '<b>Hi</b> <br><i>Your token is : ' + token + '</i>' // html body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
  });
})

app.use(express.static("public"));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist/'));

app.listen(9999, () => {
  console.info("Listening on port 9999")
});