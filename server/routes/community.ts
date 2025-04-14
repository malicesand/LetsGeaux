const express = require('express');
import { PrismaClient } from "@prisma/client";

const communityRouter = express.Router();
const prisma = new PrismaClient;

export default communityRouter;