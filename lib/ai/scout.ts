import { GoogleGenerativeAI } from "@google/generative-ai";
import Exa from "exa-js";

export const exa = new Exa(process.env.EXA_API_KEY);

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export const model = genAI.getGenerativeModel({
  model: "gemini-3-flash-preview",
});
