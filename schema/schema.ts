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