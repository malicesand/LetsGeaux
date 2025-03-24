import { urlencoded } from "express";
import express from 'express';
import path from 'path';
import passport from 'passport';
const session = require ('express-session');
require('dotenv').config();

//* import route modules here
const usersRoute = require ('./routes/users');

const DIST_DIR = path.resolve(__dirname, 'dist');
const port = 8000;
const app = express();

app.use(session({ secret: 'cats', resave:false, saveUnitialized: true })); 
app.use(passport.initialize());
app.use(passport.session());







// Google auth setup
require('./auth.ts');

//helper for login checking
function isLoggedIn(req:any, res:any, next:any) {
  req.user ? next() : res.sendStatus(401);
}

// Auth routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

app.get('/auth/google/callback', 
  passport.authenticate('google', {
    successRedirect: '/home',
    failureRedirect: '/auth/failure'
  })
);

app.get('/auth/failure', (req: any, res: any) => {
  res.send('Failed to authenticate');
});

app.get('/', (req:any, res:any) => {
  if (req.isAuthenticated()) {
    res.redirect('/home');
  } else {
    res.send('<a href="/auth/google">Authentication with Google<a>')
  }
})

app.get('/home', isLoggedIn, (req:any, res:any) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

app.get('/logout', (req:any, res:any) => {
  req.session.destroy((err:any) => {
    if (err) {
      return res.status(500).send('Failed to logout');
    }
    res.redirect('/')
  })
});

//* Link routers to express server
app.use('/users', isLoggedIn, usersRoute);

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'dist')));
app.use(express.urlencoded({ extended: true }));
// individual routing goes here
app.get('*', (req: any, res: any) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
})
// start up express server at local host 
app.listen(port, () => {
  console.log(`Let's Geaux listening @ http://localhost:${port}`)
});
