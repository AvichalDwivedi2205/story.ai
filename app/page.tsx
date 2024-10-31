"use client";
import { useState } from "react";
import axios from "axios";
import { BackgroundLines } from "@/components/ui/background-lines";
import Image from "next/image";
import bgImage from "@/assets/_b7f52e18-cda0-4aa0-a0e0-5687b53b67bd.jpeg";
import { div } from "framer-motion/client";

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
    <div>
      <BackgroundLines className="circular-gradient" svgOptions={{ duration: 10 }}>
        {/* Orbits for the background */}
        <div className="orbit orbit-1"></div>
        <div className="orbit orbit-2"></div>
        <div className="orbit orbit-3"></div>
        <div className="orbit orbit-4"></div>
        
        {/* Main content */}
        <div className="flex items-center justify-center h-screen">
          <h1 className="font-extralight text-center text-2xl sm:text-4xl lg:text-5xl">
            Transform Your Emotions into Stories <br />
            <span className="gradient-text">Experience AI-Powered Story Therapy</span>
            <br /> <br />
            <div className="text-sm sm:text-xl lg:text-2xl text-gray-500 pb-8">
              Share your feelings, and let AI craft a personalized, fictional story that reflects your emotions. Gain new perspectives through creative storytelling.
            </div>
            <button className="relative inline-flex items-center justify-center w-36 h-12 rounded-lg border border-[#03045e] overflow-hidden transition-all duration-500 ease-in z-10 group active:scale-95">
              <span className="relative z-20 text-[#babbe3] text-lg transition-colors duration-300 ease-in group-hover:text-[#e0aaff]">Get Started</span>
              <div className="absolute top-0 left-[-10px] h-full w-0 bg-[#240046] skew-x-15 transition-all duration-500 ease-in group-hover:w-[58%] z-0"></div>
              <div className="absolute top-0 right-[-10px] h-full w-0 bg-[#5a189a] skew-x-15 transition-all duration-500 ease-in group-hover:w-[58%] z-0"></div>
            </button>
          </h1>
        </div>

        {/* How it Works Section */}
      </BackgroundLines>
    </div>
  );
}
