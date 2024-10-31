import { GoogleGenerativeAI } from "@google/generative-ai";
import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from "next/server";

export async function POST(req: NextApiRequest, res: NextApiResponse){
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is not defined in the environment variables.");
        }
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({model: "gemini-pro"})

        const data = await req.body
        console.log(data)
        const result = await model.generateContent(data)
        const response = result.response.text()
        return NextResponse.json({output: response})
    } catch (error) {
        console.log("There is some error", error);
    }
}