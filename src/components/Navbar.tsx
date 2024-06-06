import React from "react";
import Link from "next/link";
import Menu from "./Menu";
import CartIcon from "./CartIcon";
import Image from "next/image";
import UserLinks from "./UserLinks";

const Navbar = () => {
  return (
    <div className="h-16 md:h-24 lg:px-20 xl:px-40  flex items-center justify-between border-b-4 border-red-600 bg-gray-100 text-gray-800 shadow-md">
      {/* LEFT LINKS */}
      <div className="hidden md:flex gap-6 flex-1">
        <Link href="/" className="hover:text-red-600 transition-colors duration-300">HOMEPAGE</Link>
        <Link href="/menu" className="hover:text-red-600 transition-colors duration-300">MENU</Link>
        <Link href="/contacts" className="hover:text-red-600 transition-colors duration-300">CONTACTS</Link>
        <Link href="/profile" className="hover:text-red-600 transition-colors duration-300">PROFILE</Link> 
      </div>
      {/* LOGO */}
      <div className="text-3xl font-bold flex-1 text-center">
        <Link href="/" className="hover:text-red-600 transition-colors duration-300">BiTE DELiGHT</Link>
      </div>
      {/* MOBILE MENU */}
      <div className="md:hidden">
        <Menu />
      </div>
      {/* RIGHT LINKS */}
      <div className="hidden md:flex gap-4 items-center flex-2 justify-end">
        <div className="flex items-center gap-2 bg-orange-500 text-white p-3 rounded-full shadow-lg">
          <Image src="/phone.png" alt="Phone" width={24} height={24} />
          <span className="whitespace-nowrap font-medium hover:text-black transition-colors duration-300">123 456 78</span> {/* Phone number */}
        </div>
        <div className="flex items-center">
          <UserLinks />
          <div className="ml-4">
            <CartIcon /> 
          </div>
        </div>
      </div>
    </div>
  );  
};

export default Navbar;