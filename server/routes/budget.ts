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
  try {
    const budgets = await prisma.budget.findMany({
      where: { group_id: req.user.groupId },
    });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: 'Error RETREIVING budgets', error });
  }
});

// Create a new budget entry
// Initialize budget with total amount and currency
router.post('/', isLoggedIn, async (req, res) => {
  const { category, limit, notes } = req.body;
  try {
    const budget = await prisma.budget.create({
      data: {
        category,
        limit,
        notes,
        group_id: req.user.groupId,
      },
    });
    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: 'Error CREATING budget', error });
  }
});

// Add category to budget
// Update budget details
router.put('/:id', isLoggedIn, async (req, res) => {
  const { category, limit, notes } = req.body;
  try {
    const budget = await prisma.budget.create({
      data: {
        category,
        limit,
        notes,
        group_id: req.user.groupId,
      },
    });
    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: 'Error UPDATING budget', error });
  }
});

// // Update category details
// // Update specific category details (like spent or allocated)
// router.put('/category/:id', isLoggedIn, async (req, res) => {
// });


// Remove a budget entry
router.delete('/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.budget.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: 'Budget entry deleted SUCCESSfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error DELETING budget', error });
  }
});

export default router;
