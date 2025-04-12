const express = require('express');
import { PrismaClient } from '@prisma/client';

const postsRouter = express.Router();
const prisma = new PrismaClient;

// GET: called when a user enters, adds, or takes away from the feed. 
// Get calls ALL posts in reverse chrono order.. maybe top 10/20?

// POST must connect to the user(params). Happens when a form is submitted. Must add createdAt tag

// DELETE Will take out a post and all its connected comments. Only the user that posted the post can remove it.

export default postsRouter;