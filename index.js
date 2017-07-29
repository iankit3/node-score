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
        res.cookie("google_email",profile.emails[0].value);
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
    console.log("REQ-USER"  +req["user"]);
    res.redirect('https://mailatnodemailer.herokuapp.com/myuser');
  });

app.use(express.static("public"));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist/'));

app.listen(app.get("port"), () => {
  console.info("Listening on port "+ app.get("port") );
});
