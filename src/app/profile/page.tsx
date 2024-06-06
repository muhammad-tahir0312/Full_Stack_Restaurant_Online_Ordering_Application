"use client";

import { User } from "../../types/types";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (session) {
          const res = await fetch(`http://localhost:3000/api/profiles/${session.user.email}`, {
            cache: "no-store",
          });
          if (!res.ok) {
            throw new Error("Failed to fetch data");
          }
          const data = await res.json();
          setProfile(data); 
          console.log(data)
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (session) {
      fetchData();
    }
  }, [router, session]); 
  
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]); 

  if (status === "loading") return "Loading...";
  if (!session || !profile) return "User not authenticated or profile not found";

  return (
    <div className="container mx-auto mt-8 p-4 lg:px-20 xl:px-40 flex flex-col items-center text-red-500">
      {session.user.isAdmin && (
        <div className="mb-2 text-left w-full">
          <p className="text-3xl font-bold mb-2 bg-red-100 p-2 rounded-md shadow-lg">Welcome, Admin!</p>
        </div>
      )}
      {/* IMAGE CONTAINER */}
      {profile.image && (
        <div className="relative w-48 h-48 rounded-full border-4 border-red-500 overflow-hidden mb-6 shadow-xl">
          <Image
            src={profile.image.toString()}
            alt="Profile Picture"
            layout="fill"
            objectFit="cover"
          />
        </div>
      )}
      <div className="max-w-2xl mx-auto bg-blue-50 p-6 rounded-lg shadow-lg border border-red-500">
        <h1 className="text-5xl font-bold uppercase mb-8 text-center">Profile Details</h1>
        <div className="mb-6 border-b border-red-500">
          <p className="text-xl font-semibold mb-2">ID:</p>
          <p className="text-xl text-gray-700">{profile.id}</p>
        </div>
        <div className="mb-6 border-b border-red-500">
          <p className="text-xl font-semibold mb-2">Name:</p>
          <p className="text-xl text-gray-700">{profile.name}</p>
        </div>
        <div className="mb-6 border-b border-red-500">
          <p className="text-xl font-semibold mb-2">Email:</p>
          <p className="text-xl text-gray-700">{profile.email}</p>
        </div>
        {!session.user.isAdmin && (
          <div className="mb-6 border-b border-red-500">
            <p className="text-xl font-semibold mb-2">Total Orders:</p>
            <p className="text-xl text-gray-700">{`Total Orders: ${profile.Order ? profile.Order.length : 0}`}</p>
          </div>
        )}
        {/* Action Buttons */}
        <div className="flex justify-around mt-8">
          <Link href={`/orders`} passHref>     
            <button className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-700 transition duration-300">View Orders</button>
          </Link>
        </div>
      </div>
    </div>
  );  
};

export default ProfilePage;