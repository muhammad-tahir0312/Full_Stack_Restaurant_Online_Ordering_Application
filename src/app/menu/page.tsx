"use client";

import DeleteButton from "../../components/DeleteCategory";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface MenuType {
  id: string;
  slug: string;
  title: string;
  desc?: string;
  img?: string;
  color: string;
}[];

const getData = async () => {
  const res = await fetch("http://localhost:3000/api/categories", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed!");
  }

  return res.json();
};

const MenuPage = () => {
  const [menu, setMenu] = useState<MenuType[]>([]);

  useEffect(() => {
    getData().then((data) => setMenu(data));
  }, []);

  return (
    <div className="container mx-auto px-4 lg:px-20 xl:px-40 mb-20 h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] flex flex-wrap items-center justify-center">
      {menu.map((category) => (
        <div key={category.id} className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 mb-8 md:mb-10 lg:mb-12 px-2">
          <Link href={`/menu/${category.slug}`} passHref>
            <div style={{ backgroundImage: `url(${category.img})`, marginTop: '1.5rem' }} className="bg-cover bg-center rounded-xl overflow-hidden h-64 md:h-72 lg:h-80 xl:h-96 relative cursor-pointer">
              <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white py-2 px-4 rounded-tl-xl text-sm font-semibold">{category.title}</div>
              <div className="absolute top-0 right-0 p-2">
                <DeleteButton id={category.id} />
              </div>
            </div>
          </Link>
          <div className="bg-white shadow-md rounded-lg p-3 mt-2">
            <h2 className="text-xl font-bold mb-2">{category.title}</h2>
            <p className="text-sm">{category.desc}</p>
            <Link href={`/menu/${category.slug}`} passHref>
              <button className="bg-black text-white py-2 px-4 rounded-md mt-2">Explore</button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );  
};

export default MenuPage;
