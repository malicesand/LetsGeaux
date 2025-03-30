import express from 'express';
import path from 'path';
import passport from 'passport';
import session from 'express-session';
import dotenv from 'dotenv';
import { urlencoded } from 'express';
import cors from 'cors';
import budgetRoute from './routes/budget';

// Import route modules
import suggestionRouter from './routes/suggestions';
import usersRoute from './routes/users';
import mapsRoute from './routes/maps';
import chatsRoute from './routes/chats';
//! add other feature route imports BELOW this line
import itineraryRoute from './routes/itinerary';

dotenv.config();

const app = express();
const port = 8000;
app.use(cors({
  origin: 'http://localhost:8000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], // 
}));
app.options('*', cors());
app.use(session({ secret: 'cats', resave:false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(urlencoded({ extended: true }));
// handling routes

// Static files
app.use(express.static(path.join(__dirname, '..', 'dist')));
app.use(cors());

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
    successRedirect: '/',
    failureRedirect: '/auth/failure',
  })
);

// Check auth
app.get('/api/check-auth', (req, res) => {
  res.json({ isAuthenticated: req.isAuthenticated(), user: req.user });
});

app.get('/auth/failure', (req: any, res: any) => {
  res.send('Failed to authenticate');
});
app.get('/', (req: any, res: any) => {
  if (req.isAuthenticated()) {
    res.redirect('/');
  } else {
    res.send('<a href="/auth/google">Authenticate with Google</a>');
  }
});
app.get('/', isLoggedIn, (req: any, res: any) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

app.get('/logout', (req: any, res: any) => {
  req.logout((err: 'error') => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out at server', err });
    }
    req.session.destroy((err: any) => {
      if (err) {
        console.error('Failed at server', err)
        return res.status(500).send('Failed to logout');
      }
      res.redirect('/');
    })
  });
});




app.use('/api/users/', usersRoute);
app.use('/api/chats/', chatsRoute);
app.use('/api/maps/', mapsRoute);
app.use('/api/suggestions', suggestionRouter);
//! add other app.use routes for features BELOW this line
// Securely link budget routes with authentication middleware
app.use('/budget', isLoggedIn, budgetRoute);
app.use('/api/itinerary', itineraryRoute)
app.use('/budget', budgetRoute);




// Catch-all route to handle all other paths and return the front-end app
app.get('*', (req: any, res: any) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
