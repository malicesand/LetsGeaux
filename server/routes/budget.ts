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
// get all budget categories and totals used in pie chart
router.get('/categories', async (req, res) => {
  const groupId = 1; // hardcoded for local testing
  try {
    const budgets = await prisma.budget.findMany({
      // filter by group ID
      //hardcoded but thats 
      where: { groupItinerary_id: 6 }, 
      select: {
        id: true,
        category: true,
        limit: true, //could include or just use `spent`
      },
    });

    // map each budget entry to format required by PieChart
    const formatted = budgets.map(budget => ({
      id: budget.id,
      category: budget.category,
      spent: budget.limit, // this is what shows up in the chart
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Error FETCHING categories', error });
  }
});

// Create a new budget entry
// Initialize budget with total amount and currency
router.post('/', async (req, res) => {
  const { limit, spent, notes, groupItinerary_id } = req.body;

  if (isNaN(limit)) {
    return res.status(400).json({ message: 'Invalid limit value' });
  }

  try {
    const budget = await prisma.budget.create({
      data: {
        limit,
        spent,
        notes,
        groupItinerary_id,
        updatedAt: new Date(),
        createdAt: new Date()
      }
    });

    res.status(201).json(budget);
  } catch (error) {
    console.error('Error CREATING budget:', error);
    res.status(500).json({ message: 'Error CREATING budget', error });
  }
});


// Add category to budget
// Update budget details
router.put('/:id', async (req, res) => {
  //grab budget id from url
  const { id } =req.params;
  const { category, limit, notes } = req.body;
  try {
    const budget = await prisma.budget.update({
      //match by primary key
      where: { id: parseInt(id) },
      data: {
        category,
        limit,
        notes,
      },
    });
    //return updated record
    res.status(200).json(budget);
  } catch (error) {
    res.status(500).json({ message: 'Error UPDATING budget', error });
  }
});

// // Update category details
// // Update specific category details (like spent or allocated)
// router.put('/category/:id', isLoggedIn, async (req, res) => {
// });


// Remove a budget entry
router.delete('/:id', async (req, res) => {
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
