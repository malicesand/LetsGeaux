import express, { Request, Response} from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from "@google/generative-ai";




import axios from 'axios'
//prisma goes here

const chatsRoute = express.Router()
const apiKey = process.env.GOOGLE_API_KEY;

//  const llm = new GoogleGenerativeAI({
//    model: string: "gemini-1.5-flash",
//    temperature: 0,
//    maxRetries: 2,
//    // apiKey: "...",
//    // other params...
//  });
export default chatsRoute;