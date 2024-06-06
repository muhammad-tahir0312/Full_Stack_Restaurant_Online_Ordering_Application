"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const UserLinks = () => {
  const { status } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      console.log("ok");
      router.push("/");
      console.log("not ok");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div>
      {status === "authenticated" ? (
        <div>
          <Link className="hover:text-red-600 transition-colors duration-300" href="/orders">ORDERS</Link>
          <span className="ml-4 cursor-pointer hover:text-red-600 transition-colors duration-300" onClick={handleLogout}>Logout</span>
        </div>
      ) : (
        <Link className="hover:text-red-600 transition-colors duration-300" href="/login">LOGIN</Link>
      )}
    </div>
  );
};

export default UserLinks;
