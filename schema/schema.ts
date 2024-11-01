export type User = {
    uid: string;               // Unique user ID from Firebase
    name: string;
    email: string;
    availableCredits: number;           // Available credits for the current day
    planType: 'free' | 'paid'; // Plan type, either 'free' or 'paid'
    dailyCreditLimit: number;  // Credit limit per day based on the plan
    lastCreditReset: Date;     // Date for last credit reset
    createdAt: Date;
  };

  export type Story = {
    storyId: string;          // Unique ID for the story
    userId: string;           // Reference to the User's uid
    title: string;            // Title or prompt of the story
    content: string;          // Actual generated story text
    moodMeter: {
      sadness: number;        // Mood levels (0-100 scale)
      hopefulness: number;
      fearfulness: number;
      happiness: number;
      anger: number;
    };
    createdAt: Date;
  };  