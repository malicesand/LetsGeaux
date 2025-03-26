import express from 'express';
import path from 'path';
import passport from 'passport';
import session from 'express-session';
import dotenv from 'dotenv';
import { urlencoded } from 'express';

// Import route modules
import usersRoute from './routes/users';
import mapsRoute from './routes/maps';

dotenv.config();

const app = express();
const port = 8000;
// Link routers to express server
app.use('/users', isLoggedIn, usersRoute);
app.use('/api/maps', mapsRoute);
// Use session, passport, and body parsers
app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, '..', 'dist')));

// Google auth setup
require('./auth.ts');

// Helper for login checking
function isLoggedIn(req: any, res: any, next: any) {
  req.user ? next() : res.sendStatus(401);
}

// Authentication routes
app.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
app.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/home',
    failureRedirect: '/auth/failure',
  })
);
app.get('/auth/failure', (req: any, res: any) => {
  res.send('Failed to authenticate');
});
app.get('/', (req: any, res: any) => {
  if (req.isAuthenticated()) {
    res.redirect('/home');
  } else {
    res.send('<a href="/auth/google">Authenticate with Google</a>');
  }
});
app.get('/home', isLoggedIn, (req: any, res: any) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});
app.get('/logout', (req: any, res: any) => {
  req.session.destroy((err: any) => {
    if (err) {
      return res.status(500).send('Failed to logout');
    }
    res.redirect('/');
  });
});



// Catch-all route to handle all other paths and return the front-end app
app.get('*', (req: any, res: any) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
