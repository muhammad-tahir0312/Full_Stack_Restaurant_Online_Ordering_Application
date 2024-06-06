import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="h-16 md:h-28 p-4 lg:px-20 xl:px-40 bg-red-500 text-white flex flex-col md:flex-row items-center justify-between">
      <div className="flex flex-col md:flex-row md:items-center">
        <Link href="/" className="font-bold text-2xl mb-2 md:mb-0 md:mr-6 text-white hover:text-black transition-colors duration-300">BiTE DELiGHT</Link>
      </div>
      <div className="text-center md:text-center">
        <p>© 2024 BiTE DELiGHT. ALL RIGHTS RESERVED.</p>
        <p>Project dedicated to MISS JAVERIA FAROOQ</p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center">
        <h2 className="mb-2 md:mb-0 md:mr-6 ">Privacy Policy</h2>
        <h2 className="">Terms of Use</h2>
      </div>
    </footer>
  );  
};

export default Footer;
