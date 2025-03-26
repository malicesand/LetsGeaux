import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

// Get budget info
// Retrieve user's budget and categories from DB
router.get('/', isLoggedIn, async (req, res) => {
});

// Create new budget
// Initialize budget with total amount and currency
router.post('/', isLoggedIn, async (req, res) => {
});

// Add category to budget
// Add a new category to user's budget
router.post('/category', isLoggedIn, async (req, res) => {
});

// Update category details
// Update specific category details (like spent or allocated)
router.put('/category/:id', isLoggedIn, async (req, res) => {
});

// Delete category
// Remove category from budget
router.delete('/category/:id', isLoggedIn, async (req, res) => {
});

export default router;
