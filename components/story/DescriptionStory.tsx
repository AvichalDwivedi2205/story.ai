"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import DropdownMenu from "./Dropdown-menu";
import CustomTextarea from "../ui/input";

function DescriptionStory() {
  const [experienceDescription, setExperienceDescription] = useState("");
  const [generatedStory, setGeneratedStory] = useState("");

  const handleGenerateStory = () => {
    setGeneratedStory(experienceDescription); // For now, it just sets the existing description as the story
  };

  return (
    <div className="flex flex-col items-center space-y-8">
      <Card className="w-full max-w-xl text-center">
        <CardHeader>
          <CardTitle>Describe Your Experience</CardTitle>
          <CardDescription>Write your story below.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-8 place-items-center">
            <DropdownMenu isEmotion={true} />
            <DropdownMenu isEmotion={false} />
          </div>
          <CustomTextarea
            placeholder="Describe your experience in detail. What happened? How did it make you feel? (120 words max)"
            value={experienceDescription}
            onInputChange={setExperienceDescription}
            wordLimit={120}
          />
        </CardContent>
        <CardFooter className="grid place-items-center">
          <button
            onClick={handleGenerateStory}
            className="relative inline-flex items-center justify-center w-36 h-12 rounded-lg border border-[#03045e] overflow-hidden transition-all duration-500 ease-in z-10 group active:scale-95"
          >
            <span className="relative z-20 text-[#babbe3] text-lg transition-colors duration-300 ease-in group-hover:text-[#e0aaff]">
              Generate Story
            </span>
            <div className="absolute top-0 left-[-10px] h-full w-0 bg-[#240046] skew-x-15 transition-all duration-500 ease-in group-hover:w-[58%] z-0"></div>
            <div className="absolute top-0 right-[-10px] h-full w-0 bg-[#5a189a] skew-x-15 transition-all duration-500 ease-in group-hover:w-[58%] z-0"></div>
          </button>
        </CardFooter>
      </Card>

      {generatedStory && (
        <Card className="w-full max-w-xl mt-8 text-center">
          <CardHeader>
            <CardTitle>Your Generated Story</CardTitle>
            <CardDescription>A summary of your experience</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{generatedStory}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default DescriptionStory;
