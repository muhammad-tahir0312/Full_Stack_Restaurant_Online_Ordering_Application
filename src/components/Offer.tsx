import Image from "next/image";
import React from "react";
import CountDown from "./CountDown";

const Offer = () => {
  return (
    <div className="bg-black h-screen flex flex-col md:flex-row md:justify-between md:bg-[url('/offerBg.png')] md:h-[70vh]">
      {/* TEXT CONTAINER */}
      <div className="flex-1 flex flex-col justify-center items-center text-center gap-8 p-6">
        <h1 className="text-white text-5xl font-bold xl:text-6xl">Discount on all Delicious Burgers</h1>
        <p className="text-white xl:text-xl">
        Nothing rivals the pleasure of sinking your teeth into our delicious burger, Who can live without our delicious burgers.
        </p>
        <CountDown/>
        <p className="text-white xl:text-xl rounded-md py-3 px-6 ">Order Now Before its too late</p>
      </div>
      {/* IMAGE CONTAINER */}
      <div className="flex-1 w-full relative md:h-full">
        <Image src="/offerProduct.png" alt="" fill className="object-contain" />
      </div>
    </div>
  );
};

export default Offer;
