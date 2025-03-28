import express, { Request, Response} from 'express';
import { GoogleGenAI } from "@google/genai";
import axios from 'axios'
import cors from 'cors';

import Prompt  from '../../src/client/types/prompt.ts';
//prisma goes here

const apiKey = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenAI({apiKey});

const chatsRoute = express.Router()
const prompt = 'hi'

chatsRoute.post('/', async (req: Request, res: Response ) => {
  const userMessage = req.body.message;

  try {
    const response = await genAI.models.generateContent({
      model: 'gemini 2.0 flash 001',
      contents: prompt,
      // temperature: 0.7,
      // streaming: false
    });

  } catch (error) { // TODO make type
    console.error(error);
    res.status(500).json({ error: 'Server Error returning prompt.'});
  }
})

export default chatsRoute;