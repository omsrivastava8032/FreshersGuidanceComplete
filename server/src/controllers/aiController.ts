import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// @desc    Chat with AI Mentor
// @route   POST /api/ai/chat
// @access  Private
export const chatWithGemini = async (req: Request, res: Response) => {
    const { message } = req.body;

    if (!process.env.GEMINI_API_KEY) {
        res.status(500).json({ message: 'Gemini API Key is not configured' });
        return;
    }

    if (!message) {
        res.status(400).json({ message: 'Message is required' });
        return;
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `
        You are a helpful, encouraging, and knowledgeable Career Mentor for university students and freshers.
        Your name is "Freshers Guide AI".
        
        Context:
        - The user is a student looking for career guidance, internship advice, or technical help.
        - Keep answers concise, practical, and easy to understand.
        - If asked about specific internships or courses on the platform, explain that you can give general advice but suggest they check the "Internships" or "Courses" page for real-time listings.
        - Be friendly and use emojis occasionally.

        User's Question: ${message}
        `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        res.json({ reply: text });
    } catch (error) {
        console.error('Gemini API Error:', error);
        res.status(500).json({ message: 'Failed to get response from AI' });
    }
};
