"use client"
import { useEffect, useState } from 'react';
import {useRouter} from "next/navigation";
import { auth, firestore } from '@/config/firebase'; // Make sure you have initialized firestore in this import
import ChatInterface from '@/components/ChatInterface';
import Sidebar from '@/components/Sidebar';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc } from 'firebase/firestore';

interface UserData {
  availableCredits: number;
  createdAt: Date;
  dailyCreditLimit: number;
  email: string;
  lastCreditReset: Date;
  name: string;
  planType: string;
  uid: string;
}

export default function Home() {
  const router = useRouter();
  const [firebaseUser, loading, error] = useAuthState(auth);
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (firebaseUser) {
        const userRef = doc(firestore, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data() as UserData;
          setUser(userData);
        } else {
          console.log("No user data found!");
        }
      }
    };

    fetchUserData();
  }, [firebaseUser]);

  // Show loading or error messages if necessary
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="relative">
      <Sidebar stories={[]} onStorySelect={() => {}} />
      {user && <ChatInterface user={user} onStoryGenerated={() => {}} />}
    </div>
  );
}
