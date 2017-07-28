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
      done(null, user);
    });

    passport.deserializeUser(function (obj, done) {
      done(null, obj);
    });
    passport.use(new GoogleStrategy(
      authConfig.google,
      function (accessToken, refreshToken, profile, done) {
        console.log(profile.emails[0].value);
        res.cookie("google_email",email);
        return done(null, profile);
      }
    ));
app.set('port', (process.env.PORT || 9999) );
app.use(cookieParser());
app.use(session({ secret: 'node man', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
    res.redirect('https://mailatnodemailer.herokuapp.com/partials/test.html');
  });
// send to google to do the authentication
app.get('/connect/google', passport.authorize('google', { scope: ['profile', 'email'] }));

// the callback after google has authorized the user
app.get('/connect/google/callback',
  passport.authorize('google', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));

app.use(express.static("public"));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist/'));

app.listen(app.get("port"), () => {
  console.info("Listening on port +"+ app.get("port") );
});
