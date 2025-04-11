const express = require('express');
import { PrismaClient } from '@prisma/client';

const postsRouter = express.Router();
const prisma = new PrismaClient;

export default postsRouter;