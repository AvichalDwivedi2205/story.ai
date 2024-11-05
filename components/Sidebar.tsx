import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { Story } from '@/schema/schema';

interface SidebarProps {
  stories: Story[];
  onStorySelect: (story: Story) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ stories, onStorySelect }) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div>
      <button 
        onClick={() => setIsActive(!isActive)} 
        className="fixed left-3 mt-2 flex z-30 items-center justify-center cursor-pointer h-10 w-10 bg-white/10 backdrop-blur-md rounded-lg"
      >
        <div className={`burger ${isActive ? 'burgerActive' : ''}`}></div>
      </button>
      
      {isActive && (
        <div className="fixed left-0 top-0 h-screen w-72 backdrop-blur-md bg-black/30 p-6 z-20">
          <div className="flex items-center gap-2 mb-8">
            <BookOpen className="w-6 h-6 text-white" />
            <button className="text-lg font-semibold text-white hover:text-gray-300">
              New Story
            </button>
          </div>
          
          <div className="space-y-4">
            {stories.map((story) => (
              <div
                key={story.storyId}
                onClick={() => onStorySelect(story)}
                className="p-3 rounded-lg backdrop-blur-md bg-white/5 cursor-pointer hover:bg-white/10"
              >
                <h3 className="text-white font-medium">{story.title}</h3>
                <p className="text-gray-400 text-sm truncate">{story.emotion}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar