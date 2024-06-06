"use client";

import React, { useState } from 'react';
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import './login.css';

// Function to generate ripple effect
// Function to generate ripple effect
const createRipple = (event: React.MouseEvent<HTMLDivElement>) => {
  const button = event.currentTarget as HTMLDivElement;
  const circle = document.createElement("span");
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;
  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - (button.offsetLeft + radius)}px`;
  circle.style.top = `${event.clientY - (button.offsetTop + radius)}px`;
  circle.classList.add("ripple");
  const ripple = button.getElementsByClassName("ripple")[0];
  if (ripple) {
    ripple.remove();
  }
  button.appendChild(circle);
};
const LoginPage = () => {
   // State to handle background image URL
   const [backgroundImageUrl, setBackgroundImageUrl] = useState('/background.png');
  const { status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  // Handle the case when the user is authenticated but not loading
  if (status === "authenticated") {
    router.push("/");
    return null; // Render nothing when redirecting
  }

  return (
    <div
      className="p-4 h-screen flex items-center justify-center bg-fixed bg-center bg-cover"
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
      // onMouseOver={(e) => createRipple(e)}
      onClick={(e) => createRipple(e)}
    >
      {/* BOX */}
      <div className="max-w-2xl mx-auto overflow-hidden bg-white rounded-lg shadow-2xl dark:bg-gray-800">
        {/* IMAGE CONTAINER */}
        <div className="bg-cover bg-center h-72 p-4" style={{ backgroundImage: "url('/loginBg.png')" }}>
          <div className="flex justify-end">
            {/* Icon Placeholder */}
          </div>
        </div>
        {/* FORM CONTAINER */}
        <div className="px-8 py-6">
          <h2 className="text-3xl font-semibold text-center text-gray-800 dark:text-white">Welcome Back!</h2>
          <p className="text-xl text-center text-gray-600 dark:text-gray-200">Log into your account now.</p>

          <div className="w-full mt-4">
            <button
              className="flex items-center justify-center w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:bg-blue-500"
              onClick={() => signIn("google")}
            >
              {/* Google Icon Placeholder */}
              <span className="mx-4">Sign in with Google</span>
            </button>
          </div>

          <div className="flex items-center justify-between mt-4">
            <span className="w-1/5 border-b dark:border-gray-600 lg:w-1/4"></span>
            <a href="/contacts" className="text-xs text-center text-gray-500 uppercase dark:text-gray-400 hover:underline">Contact us if you need help</a>
            <span className="w-1/5 border-b dark:border-gray-400 lg:w-1/4"></span>
          </div>
        </div>
      </div>
    </div>
  );
};


export default LoginPage;