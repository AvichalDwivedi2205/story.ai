"use client"
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendEmailVerification,
  UserCredential
} from "firebase/auth";
import { auth, googleProvider, firestore } from "@/config/firebase";
import { getDoc, doc, setDoc, query, collection, where, getDocs } from "firebase/firestore";

export default function AuthForm({ isSignUp }: { isSignUp: boolean }) {
  // State variables for email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const checkUserExistsByEmail = async (email: string) => {
    const usersRef = collection(firestore, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const saveUserInFirestore = async (user: UserCredential['user']) => {
    const userExists = await checkUserExistsByEmail(user.email || "");

    if (!userExists) {
      const userData = {
        uid: user.uid,
        name: user.displayName || "",
        email: user.email || "",
        createdAt: new Date(),
        availableCredits: 5,                            
        dailyCreditLimit: 5,                   
        planType: "free",                      
        lastCreditReset: new Date()            
      };
      await setDoc(doc(firestore, "users", user.uid), userData);
    } else {
      console.log("User already exists in Firestore");
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      if (isSignUp) {
        // Check if user already exists before creating account
        const userExists = await checkUserExistsByEmail(email);
        if (userExists) {
          setError("This email is already in use. Please use a different email.");
          return;
        }

        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredentials.user);
        alert("A verification email has been sent. Please check your inbox.");
        await saveUserInFirestore(userCredentials.user);
      } else {
        const userCredentials = await signInWithEmailAndPassword(auth, email, password);
        await saveUserInFirestore(userCredentials.user);
      }
      router.push("/");
    } catch (error: any) {
      // More user-friendly error messages
      switch (error.code) {
        case 'auth/weak-password':
          setError("Password is too weak. Please choose a stronger password.");
          break;
        case 'auth/email-already-in-use':
          setError("This email is already registered. Please use a different email.");
          break;
        case 'auth/invalid-email':
          setError("Invalid email format. Please enter a valid email address.");
          break;
        case 'auth/wrong-password':
          setError("Incorrect password. Please try again.");
          break;
        case 'auth/user-not-found':
          setError("No account found with this email. Please sign up first.");
          break;
        default:
          setError("An error occurred. Please try again.");
      }
    }
  }

  const handleGoogleProvide = async () => {
    try {
      const userCredentials = await signInWithPopup(auth, googleProvider);
      await saveUserInFirestore(userCredentials.user);
      router.push("/");
    } catch (error: any) {
      setError(error.message);
    }
  }

  return (
    <div className="auth-form-container flex flex-col items-center justify-center min-h-screen">
      <div className="card-gradient p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-center gradient-text text-3xl font-bold mb-6">
          Welcome To Story.AI
        </h2>
        
        {/* Display error message if exists */}
        {error && (
          <div className="mb-4 p-3 bg-red-900 text-white rounded">
            {error}
          </div>
        )}
        
        <form className="auth-form bg-opacity-90 p-8 rounded-lg" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-white text-sm font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-purple-500 hover:bg-gray-700 transition duration-150 hover:cursor-text"
              placeholder="Enter your email"
              required
            />
          </div>
          
          {/* Password Input */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-white text-sm font-semibold mb-3">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="hover:cursor-text w-full p-3 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-purple-500 hover:bg-gray-700 transition duration-150"
              placeholder="Enter your password"
              required
              minLength={6} // Added minimum password length
            />
          </div>
          
          {/* Sign Up / Sign In Button */}
          <button 
            className="relative inline-flex items-center justify-center w-full h-12 rounded-lg border border-[#03045e] overflow-hidden transition-all duration-500 ease-in z-10 group active:scale-95"
            type="submit"
          >
            <span className="relative z-20 text-[#babbe3] text-lg transition-colors duration-300 ease-in group-hover:text-[#e0aaff]">
              {isSignUp ? "Sign Up" : "Sign In"}
            </span>
            <div className="absolute top-0 left-[-10px] h-full w-0 bg-[#240046] skew-x-15 transition-all duration-500 ease-in group-hover:w-[58%] z-0"></div>
            <div className="absolute top-0 right-[-10px] h-full w-0 bg-[#5a189a] skew-x-15 transition-all duration-500 ease-in group-hover:w-[58%] z-0"></div>
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-4">
          <hr className="flex-grow border-t border-gray-600" />
          <span className="text-gray-400 mx-2">OR</span>
          <hr className="flex-grow border-t border-gray-600" />
        </div>

        {/* Google Sign In Button */}
        <button 
          className="relative inline-flex items-center justify-center w-full h-12 rounded-lg border border-[#03045e] overflow-hidden transition-all duration-500 ease-in z-10 group active:scale-95"
          onClick={handleGoogleProvide}
        >
          <span className="relative z-20 text-[#babbe3] text-lg transition-colors duration-300 ease-in group-hover:text-[#e0aaff]">
            {isSignUp ? "Sign Up with Google" : "Sign In with Google"}
          </span>
          <div className="absolute top-0 left-[-10px] h-full w-0 bg-[#240046] skew-x-15 transition-all duration-500 ease-in group-hover:w-[58%] z-0"></div>
          <div className="absolute top-0 right-[-10px] h-full w-0 bg-[#5a189a] skew-x-15 transition-all duration-500 ease-in group-hover:w-[58%] z-0"></div>
        </button>
      </div>
    </div>
  );
}