import express, { Request, Response} from 'express';
import { GoogleGenAI } from "@google/genai";
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const apiKey = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenAI({apiKey});

import { PromptKey, prompts, contextKeywords} from '../../types/prompt.ts';
// * CONTEXT * //
const detectContext = (input: string): PromptKey => {
  let lowerCaseMessage = input.toLowerCase();
  // find match based of keywords
  const detectedContext = (Object.keys(contextKeywords) as PromptKey[]).find((key) =>
  contextKeywords[key].some((keyword) => lowerCaseMessage.includes(keyword)) );
  return detectedContext || "default";
}


// * ROUTING * //
const chatsRoute = express.Router()

chatsRoute.get('/:sessionId', async (req: Request, res: Response) => {
  // chat history retrieval
  // session id = req params
  // messages = find many w/ session Id
});

//* Session Id *//
chatsRoute.post('/new-session', (req: Request, res: Response) => {
  const sessionId: string = uuidv4();
  res.json({ sessionId });
  console.log('Session ID created for this chat:', sessionId) 
});

chatsRoute.post('/', async (req: Request, res: Response ) => {
  const { message, userId, sessionId} = req.body;
  
  let conversationId = sessionId || uuidv4();
  // check for ID or create
  
  // fetch context
  // let lastContext =  // TODO context handling for replies and history
  console.log(conversationId)
 

  
  const context = detectContext(message);
  const prompt = prompts[context] 
  
  try {
    const response = await genAI.models.generateContent({ // TODO type
      model: 'gemini-2.0-flash',
      contents: prompt, 

    });
  const responseParts = response.candidates[0].content.parts[0] // TODO type
  const aIReply: string  = responseParts?.text || 'no response from Gata';
  await prisma.chatHistory.create({ // ? idk how this is actively adding w/o a declaration
    data: {
      userId: userId,
      userMessage: message,
      botResponse: aIReply,
      sessionId: sessionId
    }
  })
  res.json(aIReply);
    } catch (error) { // TODO make type
      console.error(error);
      res.status(500).json({ error: 'Server Error returning prompt.'});
    }
});

chatsRoute.patch('/', async (req: Request, res: Response) => {
  // ? update a session ? Another join table??
  // * also could do a trigger where this updates a user's interests 
    // useContext is already employed
});
chatsRoute.patch('/', async (req: Request, res: Response) => {
  // update a the history
});

chatsRoute.delete('/', async (req: Request, res: Response) => {
  // delete a message
  // 
});



export default chatsRoute;