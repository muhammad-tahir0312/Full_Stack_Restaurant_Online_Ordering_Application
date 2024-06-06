"use client";
import { ProductType } from "../types/types";
import { useRouter } from "next/navigation";
import Image from "next/image";
import React from "react";

const getData = async () => {
  const res = await fetch("http://localhost:3000/api/products", {
    cache: "no-store"
  });

  if (!res.ok) {
    throw new Error("Failed!");
  }

  return res.json();
};

const Featured = () => {
  const router = useRouter(); // Move useRouter inside the Featured component

  const handleOrderNowClick = () => {
    router.push("/menu");
  };

  const fetchFeaturedProducts = async () => {
    try {
      const featuredProducts: ProductType[] = await getData();
      return featuredProducts;
    } catch (error) {
      console.error("Failed to fetch featured products:", error);
      return [];
    }
  };

  const [featuredProducts, setFeaturedProducts] = React.useState<ProductType[]>([]);

  React.useEffect(() => {
    fetchFeaturedProducts().then((products) => {
      setFeaturedProducts(products);
    });
  }, []);

  return (
    <div className="w-screen overflow-x-scroll text-red-500 flex justify-center">
      {/* WRAPPER */}
      <div className="w-max flex justify-center">
        {/* SINGLE ITEM */}
        {featuredProducts.map((item) => (
          <div
            key={item.id}
            className="w-screen h-[70vh] flex flex-col items-center justify-around p-4 hover:bg-fuchsia-50 transition-all duration-300 md:w-[50vw] xl:w-[33vw] xl:h-[100vh]"
          >
            {/* IMAGE CONTAINER */}
            {item.img && (
              <div className="relative flex-1 w-full hover:rotate-[60deg] transition-all duration-500">
                <Image src={item.img} alt="" fill className="object-contain" />
              </div>
            )}
            {/* TEXT CONTAINER */}
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
              <h1 className="text-xl font-bold uppercase xl:text-2xl 2xl:text-3xl">{item.title}</h1>
              <p className="p-4 2xl:p-8">{item.desc}</p>
              <span className="text-xl font-bold">${item.price}</span>
              <button className="bg-red-500 text-white p-2 rounded-md hover:bg-black transition duration-300" onClick={handleOrderNowClick}>
                Go to Menu
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 
  export default Featured;
  