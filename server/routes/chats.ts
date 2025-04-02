import express, { Request, Response} from 'express';
import { GoogleGenAI } from "@google/genai";
import axios from 'axios'

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { v4 as uuidv4 } from 'uuid';


import { PromptKey, prompts}  from '../../src/client/types/prompt.ts';


const apiKey = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenAI({apiKey});

const chatsRoute = express.Router()

chatsRoute.get('/', async (req: Request, res: Response) => {

});

chatsRoute.post('/new-session', (req: Request, res: Response) => {
  const sessionId: string = uuidv4();
  res.json({ sessionId });
  console.log('Session ID created for this chat:', sessionId)
});

chatsRoute.post('/', async (req: Request, res: Response ) => {
  const prompt = prompts.default
  const userMessage = req.body.message;
  const userId = req.body.userId;

  try {
    const response = await genAI.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,

    });
const responseParts = response.candidates[0].content.parts[0]
const aIReply: string  = responseParts?.text || 'no response from Gata';
const chatPost = await prisma.chatHistory.create({
  data: {
    userId: userId,
    userMessage: userMessage,
    botResponse: aIReply,
  }
})
res.json(aIReply);
  } catch (error) { // TODO make type
    console.error(error);
    res.status(500).json({ error: 'Server Error returning prompt.'});
  }
});

chatsRoute.patch('/', async (req: Request, res: Response) => {
  
})
export default chatsRoute;