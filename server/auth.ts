const passport = require ('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

// const {GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET} = process.env;

const GOOGLE_CLIENT_ID: string = process.env.GOOGLE_CLIENT_ID  ;
const GOOGLE_CLIENT_SECRET: string = process.env.GOOGLE_CLIENT_SECRET  

passport.use(new GoogleStrategy ({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:8000/auth/google/callback',
  passReqToCallback: true
},
  function (request:any, accessToken:any, refreshToken:any, profile:any, done:any) {
    return done(null, profile);
  }
));

passport.serializeUser(function (user:any, done:any) {
  done(null, user);
});

passport.deserializeUser(function (user:any, done:any) {
  done(null, user);
});






