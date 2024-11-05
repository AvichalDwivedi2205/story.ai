import React, { useState, useEffect } from 'react';
import { auth, firestore } from '@/config/firebase';
import { collection, query, orderBy, limit, deleteDoc, doc, where, getDocs } from 'firebase/firestore';
import { Trash2, Loader2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

// Define the Story interface
interface Story {
  id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: Date;
}

interface SidebarProps {
  isActive: boolean;
  setIsActive: (isActive: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isActive, setIsActive }) => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  // Fetch stories
  const fetchStories = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const storiesRef = collection(firestore, 'stories');
      const q = query(
        storiesRef,
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc'),
        limit(20)
      );

      const querySnapshot = await getDocs(q);
      const storiesData = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      } as Story));
      setStories(storiesData);
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  // Delete single story
  const handleDeleteStory = async (storyId: string) => {
    try {
      await deleteDoc(doc(firestore, 'stories', storyId));
      setStories(prev => prev.filter(story => story.id !== storyId));
    } catch (error) {
      console.error('Error deleting story:', error);
    }
  };

  // Delete all stories
  const handleDeleteAllStories = async () => {
    try {
      setDeleting(true);
      const user = auth.currentUser;
      if (!user) return;

      const storiesRef = collection(firestore, 'stories');
      const q = query(storiesRef, where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);

      const deletePromises = querySnapshot.docs.map(doc => 
        deleteDoc(doc.ref)
      );

      await Promise.all(deletePromises);
      setStories([]);
    } catch (error) {
      console.error('Error deleting all stories:', error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      {/* Burger Menu Button */}
      <div
        onClick={() => setIsActive(!isActive)}
        className="fixed left-3 mt-2 flex z-30 items-center justify-center cursor-pointer h-10 w-10 bg-white/10 backdrop-blur-md rounded-lg"
      >
        <div className={isActive ? "burgerActive" : "burger"}></div>
      </div>

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-screen w-72 bg-background border-r z-20 transform transition-transform duration-300 ease-in-out ${isActive ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6 mt-14">
            <h2 className="text-xl font-bold">Your Stories</h2>
            {stories.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="flex items-center gap-2">
                    {deleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" />
                        Delete All
                      </>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete all your stories.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAllStories}>Delete All</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : stories.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No stories yet
              </div>
            ) : (
              <div className="space-y-4">
                {stories.map((story) => (
                  <div key={story.id} className="p-3 rounded-lg border bg-card relative group">
                    <h3 className="font-medium mb-1">{story.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{story.content}</p>
                    <button
                      onClick={() => handleDeleteStory(story.id)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;