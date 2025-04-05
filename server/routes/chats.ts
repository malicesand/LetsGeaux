import express, { Request, Response} from 'express';
import { GoogleGenAI } from "@google/genai";
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const apiKey = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenAI({apiKey}); 
import { PromptKey, prompts, contextKeywords} from '../../types/prompt.ts';

const chatsRoute = express.Router()

// * Chat Context * //
const detectContext = (input: string): PromptKey => {
  let lowerCaseMessage = input.toLowerCase();
  // find match based of keywords   
  const detectedContext = (Object.keys(contextKeywords) as PromptKey[]).find((key) =>
  contextKeywords[key].some((keyword) => lowerCaseMessage.includes(keyword)) );
  return detectedContext || "default";
};


// * Request Handling *//
// Get Chat History
chatsRoute.get('/chat-history/:userId', async (req: Request, res: Response) => {
  // find chatBot conversations for current user
  const {userId} = req.params
  try {
    const chatHistories = await prisma.chatHistory.findMany({
      // request handling manipulates type => convert to number
      where: {userId: Number(userId)}
    })
    console.log('found user sessions');
    res.json(chatHistories)
 
  } catch (error) {
      console.error(error);
      res.status(500).json({error: 'failed to fetch user chat history'})
  }
});

//* Session Id *//
chatsRoute.post('/new-session', (req: Request, res: Response) => {
  try {
    const sessionId: string = uuidv4();
    console.log('Session ID created for this chat:', sessionId) 
    res.json({ sessionId });
  } catch (error) {
      res.status(500).json({error: 'failed to create session ID'});
  }
});

//* Conversation *//
chatsRoute.post('/', async (req: Request, res: Response ) => {
  const { userMessage, userId, sessionId} = req.body;
  // console.log(sessionId)
  // TODO fetch context
  const convoHistory = await prisma.chatHistory.upsert({
    where: { sessionId },
    update: { lastActive: new Date()},
    create: {
      sessionId,
      userId
    }
  })
  let messages = await prisma.message.findMany({
    where: { sessionId : sessionId },
    orderBy: { timeStamp: 'asc'},
  });
  // console.log(messages.length);
  // TODO context handling for replies and history
  // if (messages.length > )
  const context = detectContext(userMessage);
  const prompt = prompts[context] 
  
  try {
    const response = await genAI.models.generateContent({ // TODO type
      model: 'gemini-2.0-flash',
      contents: prompt, 

    });
  const responseParts = response.candidates[0].content.parts[0] // TODO type
  const aIReply: string  = responseParts?.text || 'no response from Gata';
  await prisma.message.create({ // ? idk how this is actively adding w/o a declaration
    data: {
      userId: userId,
      userMessage: userMessage,
      botResponse: aIReply,
      sessionId: sessionId
    }
  })
  // console.log('successful convo')
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