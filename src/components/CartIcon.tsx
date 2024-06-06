"use client";

import { useCartStore } from "../utils/store";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";

const CartIcon = () => {
  const { data: session } = useSession();
  const { totalItems } = useCartStore();

  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  return (
    <div className="flex items-center gap-4">
      {session?.user.isAdmin ? (
        <>
          <Link href="/add">
            <button className="p-1 bg-red-500 text-white rounded-md hover:bg-black transition duration-300">Add Product</button>
          </Link>
          <Link href="/addcategory">
            <button className="p-1 bg-red-500 text-white rounded-md hover:bg-black transition duration-300">Add Category</button>
          </Link>
        </>
      ) : (
        <Link href="/cart" className="flex items-center"> {/* Flex container for Cart and Image */}
          <span className="mr-2 hover:text-red-600 transition-colors duration-300">CART ({totalItems})</span>
          <div className="relative w-8 h-8 md:w-5 md:h-5">
            <Image
              src="/cart.png"
              alt=""
              fill
              sizes="10%"
              className="object-contain"
            />
          </div>
        </Link>
      )}
    </div>
  );
};

export default CartIcon;
