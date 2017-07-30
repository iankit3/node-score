const express = require("express"),
      bodyParser = require("body-parser"),
      app = express();
      router = require("./routes");

var authConfig = require('./config/auth'),
    cookieParser = require("cookie-parser"),
    session = require('express-session'),
    passport = require('passport'),
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

    passport.serializeUser(function (user, done) {
      done(null, {
         email: user.emails[0].value
      });
    });

    passport.deserializeUser(function (obj, done) {
      done(null, obj);
    });
    passport.use(new GoogleStrategy(
      authConfig.google,
      function (accessToken, refreshToken, profile, done) {
        return done(null, profile);
      }
    ));
app.set('port', (process.env.PORT || 9999) );
app.use(cookieParser());
app.use(session({ secret: 'node man', resave: false, saveUninitialized: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/partials/index.html")
})
app.use("/api/", router);

app.get('/auth/google', passport.authenticate('google', { scope: ['openid', 'email', 'profile'] }));
app.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login'
  }),
  function (req, res) {
    res.cookie("google_email",req.user.emails[0].value);

    if(req.user.emails[0].value == req.cookies.token_email)
      res.redirect('/api/myuser');  
    else 
      res.end("Email mismatch");
    
  });

app.use(express.static("public"));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist/'));

app.listen(app.get("port"), () => {
  console.info("Listening on port "+ app.get("port") );
});
