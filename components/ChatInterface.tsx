"use client"
import React, { useState, useEffect, useRef } from 'react';
import { User } from '@/schema/schema';
import ChatMessage from './ChatMessage';
import CreditsDisplay from "./CreditsDisplay";
import { Story } from '@/schema/schema';
import { auth, firestore } from "@/config/firebase";
import axios from 'axios';
import { PenSquare } from 'lucide-react';
import { collection, addDoc, getDocs, deleteDoc, query, orderBy, limit, doc, updateDoc } from "firebase/firestore";

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
    updateUserCredits();
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

  const addStoryToFirestore = async (newStory: Story) => {
    const storiesRef = collection(firestore, "stories");
    const userStoriesQuery = query(storiesRef, orderBy("createdAt", "desc"), limit(20));
    const userStoriesSnapshot = await getDocs(userStoriesQuery);
  
    if (userStoriesSnapshot.size >= 20) {
      const oldestStoryDoc = userStoriesSnapshot.docs[userStoriesSnapshot.size - 1];
      await deleteDoc(doc(storiesRef, oldestStoryDoc.id));
    }
  
    await addDoc(storiesRef, newStory);
  };

  const generateStoryWithGemini = async () => {
    if (user.availableCredits <= 0) {
      setMessages(prev => [...prev, {
        content: "You've used all your available credits for today. Please try again tomorrow or upgrade to premium plan to experience more daily.",
        isUser: false
      }]);
      return;
    }

    setIsGenerating(true);
    setMessages(prev => [...prev, { 
      content: "Generating your personalized story...", 
      isUser: false 
    }]);

    const prompt = `You are saint like who understands that how you are is completely in your control and all emotions are generated from within. A user is reaching out for help in understanding and processing their emotions.  
    1. **User's Current Emotion**: ${userResponses.emotion}  
    2. **What the user wants to feel**: ${userResponses.desiredOutcome}  
    3. **Why I feel this way**: "${userResponses.backgroundStory}"  
    Based on the following information about yje user generate a story to offer the user a fresh persepctive. Remember the following instructions 
    - Be around 300-500 words
    - Offer a fresh perspective on their situation
    - Help them see how emotions are influenced by inner perceptions
    - Focus on personal growth and emotional transformation
    - Finally the story should be a completely new story and should start with something like for example - "Once, in a quiet village"
    - Make the story very simple to understand with not much hard english
    `;

    try {
      const response = await axios.post("/api/generate", { body: prompt });
      const generatedStory = response.data.output;
      
      setMessages(prev => prev.slice(0, -1));
      
      setMessages(prev => [...prev, { content: generatedStory, isUser: false }]);
      
      const newStory: Story = {
        storyId: Date.now().toString(),
        userId: user.uid,
        title: `${userResponses.emotion} to ${userResponses.desiredOutcome}`,
        content: generatedStory,
        emotion: userResponses.emotion,
        outcome: userResponses.desiredOutcome,
        createdAt: new Date()
      };

      onStoryGenerated(newStory);
      await addStoryToFirestore(newStory); // Store in Firestore
      await updateUserCredits();
      setIsStoryComplete(true);
      
    } catch (error) {
      console.error('Error generating story:', error);
      setMessages(prev => prev.slice(0, -1)); 
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
      <div className="fixed top-4 right-4 z-10">
        <CreditsDisplay 
          availableCredits={user.availableCredits}
          dailyCreditLimit={user.dailyCreditLimit}
        />
      </div>
      
      <div className="max-w-3xl mx-auto pt-16 pb-24">
        <div className="space-y-4 h-[70vh] overflow-y-auto bg-white/10 p-4 rounded-lg mb-4" style={{ scrollbarWidth: 'thin' }}>
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
              className="w-full p-4 rounded-lg bg-purple-600/30 backdrop-blur-xl text-white 
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
                className="w-full p-4 pr-16 rounded-lg bg-white/10 backdrop-blur-md text-white 
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

export default ChatInterface;
