const express = require('express');
import { PrismaClient } from '@prisma/client';

const suggestionRouter = express.Router();
const prisma = new PrismaClient();
// GET request handling
suggestionRouter.get('/', async (req: any, res: any) => {
  const allSugg = await prisma.suggestion.findMany().then(()=> {
    res.status(200).send('looks Like we Made it!!!');
  }).catch((err:any) => {
    console.error("FAIL!!", err);
    res.sendStatus(500);
  });
})

export default suggestionRouter;
