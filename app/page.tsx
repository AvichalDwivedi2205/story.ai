"use client";
import { useState } from "react";
import axios from "axios";
import { BackgroundLines } from "@/components/ui/background-lines";

export default function Home() {
  const prompt = "I am very depressed. Write me a story to cheer me up. It should start with The story goes like this";
  const [output, setOutput] = useState("Ok bro!");

  const generateText = async () => {
    try {
      const response = await axios.post("/api/generate", { body: prompt });
      setOutput(response.data.output);
    } catch (error) {
      console.error("This is the error", error);
      setOutput("Error generating content.");
    }
  };

  return (
    <BackgroundLines className="circular-gradient" svgOptions={{ duration: 10 }}>
      {/* Orbits for the background */}
      <div className="orbit orbit-1"></div>
      <div className="orbit orbit-2"></div>
      <div className="orbit orbit-3"></div>
      <div className="orbit orbit-4"></div>
      <div className="orbit orbit-5"></div>
      <div className="orbit orbit-6"></div>

      {/* Main content */}
      <div className="flex items-center justify-center h-screen">
        <h1 className="font-extralight text-center text-2xl sm:text-4xl">
          Transform Your Emotions into Stories <br />
          <span className="gradient-text">Experience AI-Powered Story Therapy</span>
        </h1>
      </div>
    </BackgroundLines>
  );
}
