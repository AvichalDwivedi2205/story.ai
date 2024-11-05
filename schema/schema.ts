export interface User {
  uid: string;
  email: string;
  name: string;
  availableCredits: number;
  dailyCreditLimit: number;
  planType: string;
  lastCreditReset: Date;
  createdAt: Date;
}

  export type Story = {
    storyId: string;          // Unique ID for the story
    userId: string;           // Reference to the User's uid
    title: string;            // Title or prompt of the story
    content: string;          // Actual generated story text
    emotion: string;
    outcome: string;
    createdAt: Date;
  };  

  export const emotions = [
    "Happy",
    "Sad",
    "Angry",
    "Fearful",
    "Anxious",
    "Hopeless",
    "Frustrated",
    "Bored",
    "Ashamed",
    "Guilty",
    "Jealous",
    "Lonely",
    "Overwhelmed"
  ];

  export const outcomes = [
    "Positive",
    "Successful",
    "Satisfying",
    "Inspiring",
    "Calming",
    "Hopeful",
    "Relieved",
    "Motivated",
    "Empowered",
    "Confident",
    "Grateful",
    "Joyful",
    "Peaceful",
    "Fulfilled"
  ];