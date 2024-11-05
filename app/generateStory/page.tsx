"use client"
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { auth, firestore } from '@/config/firebase';
import ChatInterface from '@/components/ChatInterface';
import Sidebar from '@/components/Sidebar';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc, collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';

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
  const [isSidebarActive, setIsSideBarActive] = useState(false);
  const router = useRouter();
  const [firebaseUser, loading, error] = useAuthState(auth);
  const [user, setUser] = useState<UserData | null>(null);
  const [stories, setStories] = useState([]); // State to hold stories for Sidebar

  // Fetch user data
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

  // Real-time listener for stories collection
  useEffect(() => {
    const storiesRef = collection(firestore, 'stories');
    const userStoriesQuery = query(storiesRef, orderBy('createdAt', 'desc'), limit(20));

    const unsubscribe = onSnapshot(userStoriesQuery, (snapshot:any) => {
      const updatedStories = snapshot.docs.map((doc:any) => ({
        ...(doc.data()),
        storyId: doc.id,
      }));
      setStories(updatedStories); // Update stories for Sidebar
    });

    return () => unsubscribe(); // Clean up the listener on component unmount
  }, []);

  // Show loading or error messages if necessary
  if (loading) return (
    <div role="status">
      <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="..." fill="currentColor"/>
        <path d="..." fill="currentFill"/>
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="relative">
      <Sidebar isActive={isSidebarActive} setIsActive={setIsSideBarActive} /> {/* Pass stories */}
      {user && <ChatInterface user={user} onStoryGenerated={() => {}} />}
    </div>
  );
}
