"use client"
import React, { useState, useEffect, useRef } from 'react';
import { User } from '@/schema/schema';
import ChatMessage from './ChatMessage';
import CreditsDisplay from "./CreditsDisplay"
import { Story } from '@/schema/schema';
import { auth, firestore } from "@/config/firebase"
import axios from 'axios';
import { doc, updateDoc } from 'firebase/firestore';
import { PenSquare } from 'lucide-react';

interface ChatInterfaceProps {
  user: User;
  onStoryGenerated: (story: Story) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ user, onStoryGenerated }) => {
  const [messages, setMessages] = useState<Array<{ content: string; isUser: boolean }>>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [userResponses, setUserResponses] = useState({
    emotion: '',
    desiredOutcome: '',
    backgroundStory: ''
  });
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isStoryComplete, setIsStoryComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const questions = [
    "Take a moment to reflect. How would you describe the emotion you're feeling most strongly right now? Examples: calm, frustrated, anxious, hopeful, or something else.",
    "What are you hoping this story will bring to you? Maybe you'd like to feel more at peace, gain a sense of clarity, feel uplifted, or simply gain a new perspective.",
    "If you're comfortable sharing, what event or experience has brought up this feeling for you? This could be something recent or a situation that's been on your mind for a while."
  ];

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ content: questions[0], isUser: false }]);
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const updateUserCredits = async () => {
    try {
      const userRef = doc(firestore, 'users', user.uid);
      await updateDoc(userRef, {
        availableCredits: user.availableCredits - 1
      });
    } catch (error) {
      console.error('Error updating credits:', error);
    }
  };

  const startNewStory = () => {
    setMessages([{ content: questions[0], isUser: false }]);
    setCurrentStep(0);
    setUserResponses({
      emotion: '',
      desiredOutcome: '',
      backgroundStory: ''
    });
    setInput('');
    setIsStoryComplete(false);
  };

  const generateStoryWithGemini = async () => {
    if (user.availableCredits <= 0) {
      setMessages(prev => [...prev, {
        content: "You've used all your available credits for today. Please try again tomorrow.",
        isUser: false
      }]);
      return;
    }

    setIsGenerating(true);
    setMessages(prev => [...prev, { 
      content: "Generating your personalized story...", 
      isUser: false 
    }]);

    const prompt = `You are an insightful storyteller. A user is reaching out for help in understanding and processing their emotions. 
    1. **User's Current Emotion**: ${userResponses.emotion}  
    2. **Desired Outcome**: ${userResponses.desiredOutcome}  
    3. **Background Story**: "${userResponses.backgroundStory}"  
    Based on the emotion the user is currently feeling, their desired outcome, and the background story they've shared, please craft a personalized narrative. The story should:
    - Be around 300-500 words
    - Offer a fresh perspective on their situation
    - Help them see how emotions are influenced by inner perceptions
    - Be engaging and empathetic
    - Focus on personal growth and emotional transformation`;

    try {
      const response = await axios.post("/api/generate", { body: prompt });
      const generatedStory = response.data.output;
      
      // Remove the "Generating..." message
      setMessages(prev => prev.slice(0, -1));
      
      // Add the generated story
      setMessages(prev => [...prev, { content: generatedStory, isUser: false }]);
      
      const newStory: Story = {
        storyId: Date.now().toString(),
        userId: user.uid,
        title: userResponses.emotion,
        content: generatedStory,
        emotion: userResponses.emotion,
        outcome: userResponses.desiredOutcome,
        createdAt: new Date()
      };

      onStoryGenerated(newStory);
      await updateUserCredits();
      setIsStoryComplete(true);
      
    } catch (error) {
      console.error('Error generating story:', error);
      setMessages(prev => prev.slice(0, -1)); // Remove "Generating..." message
      setMessages(prev => [...prev, { 
        content: "I apologize, but I encountered an error while generating your story. Please try again.", 
        isUser: false 
      }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;

    setMessages(prev => [...prev, { content: input, isUser: true }]);
    
    switch (currentStep) {
      case 0:
        setUserResponses(prev => ({ ...prev, emotion: input }));
        setMessages(prev => [...prev, { content: questions[1], isUser: false }]);
        setCurrentStep(1);
        break;
      case 1:
        setUserResponses(prev => ({ ...prev, desiredOutcome: input }));
        setMessages(prev => [...prev, { content: questions[2], isUser: false }]);
        setCurrentStep(2);
        break;
      case 2:
        setUserResponses(prev => ({ ...prev, backgroundStory: input }));
        setCurrentStep(3);
        await generateStoryWithGemini();
        break;
    }

    setInput('');
  };

  return (
    <div className="circular-gradient min-h-screen p-4">
      <CreditsDisplay 
        availableCredits={user.availableCredits}
        dailyCreditLimit={user.dailyCreditLimit}
      />
      
      <div className="max-w-3xl mx-auto pt-16 pb-24">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              content={message.content}
              isUser={message.isUser}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="fixed bottom-4 left-0 right-0 max-w-3xl mx-auto px-4">
          {isStoryComplete ? (
            <button
              onClick={startNewStory}
              className="w-full p-4 rounded-lg bg-purple-600/30 backdrop-blur-md text-white 
                       hover:bg-purple-500/40 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <PenSquare className="w-5 h-5" />
              Start New Story
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isGenerating}
                className="w-full p-4 rounded-lg bg-white/10 backdrop-blur-md text-white 
                         placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 
                         disabled:opacity-50"
                placeholder={isGenerating ? "Generating story..." : "Type your message..."}
              />
              <button
                type="submit"
                disabled={isGenerating}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white 
                         hover:text-purple-400 disabled:opacity-50 disabled:hover:text-white"
              >
                Send
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface