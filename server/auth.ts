import { PrismaClient } from "@prisma/client";
import passport from "passport";

const passports = require ('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const prisma = new PrismaClient

// const {GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET} = process.env;

const GOOGLE_CLIENT_ID: string = process.env.GOOGLE_CLIENT_ID  ;
const GOOGLE_CLIENT_SECRET: string = process.env.GOOGLE_CLIENT_SECRET

passports.use(new GoogleStrategy ({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:8000/auth/google/callback',
  passReqToCallback: true
},
async (token: string, tokenSecret: string, profile: any, done: passport.VerifyCallback) => {
  try {
    // Check if the user already exists by Google ID
    let user = await prisma.user.findUnique({
      where: { googleId: profile.id },
    });

    // If the user doesn't exist, create a new one
    if (!user) {
      user = await prisma.user.create({
        data: {
          googleId: profile.id,
          username: profile.displayName,
          email: profile.emails[0].value,
        },
      });
    }

    // Return the user to the callback function
    return done(null, user);
  } catch (error) {
    return done(error, null); // Pass error to the callback if something goes wrong
  }
}));

// Serialize user into the session (store user id)
passports.serializeUser((user:any , done) => {
  done(null, user.id); // Storing the user ID in the session
});

// Deserialize user from the session (retrieve user by id)
passports.deserializeUser(async (id: any, done) => {
  try {
    // Fetch the user from the database by ID
    const user = await prisma.user.findUnique({
      where: { id },
    });
    
    // Pass the user object back to the session
    done(null, user);
  } catch (error) {
    done(error, null); // Pass error to the callback if something goes wrong
  }
});






