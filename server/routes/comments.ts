const express = require('express')
import { PrismaClient } from '@prisma/client';

const commentsRouter = express.Router();
const prisma = new PrismaClient;

export default commentsRouter;