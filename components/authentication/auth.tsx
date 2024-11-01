"use client"
import React, { useState } from "react";
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendEmailVerification,
} from "firebase/auth";
import { auth, googleProvider } from "@/config/firebase";

export default function AuthForm({ isSignUp }: { isSignUp: boolean }) {
  // State variables for email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if(isSignUp){
      
    }
  }

  return (
    <div className="auth-form-container flex flex-col items-center justify-center min-h-screen">
      <div className="bg-gray-950 p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-center gradient-text text-3xl font-bold mb-6">
          Welcome To Story.AI
        </h2>
        
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
            />
          </div>
          
          {/* Sign Up / Sign In Button */}
           {/* Sign Up / Sign In Button */}
           <button className="relative inline-flex items-center justify-center w-full h-12 rounded-lg border border-[#03045e] overflow-hidden transition-all duration-500 ease-in z-10 group active:scale-95"
            type="submit">
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
        <button className="relative inline-flex items-center justify-center w-full h-12 rounded-lg border border-[#03045e] overflow-hidden transition-all duration-500 ease-in z-10 group active:scale-95">
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
