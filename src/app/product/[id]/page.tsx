"use client";

import DeleteButton from "../../../components/DeleteButton";
import Price from "../../../components/Price";
import { ProductType } from "../../../types/types";
import Image from "next/image";
import React from "react";
import { useSession } from "next-auth/react";

const getData = async (id: string) => {
  const res = await fetch(`http://localhost:3000/api/products/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed!");
  }

  return res.json();
};

const SingleProductPage = ({ params }: { params: { id: string } }) => {
  const { data: session, status } = useSession();
  const [singleProduct, setSingleProduct] = React.useState<ProductType | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const productData: ProductType = await getData(params.id);
        setSingleProduct(productData);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchData();
  }, [params.id]);

  if (!singleProduct) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 lg:px-20 xl:px-40 h-screen flex flex-col justify-around text-red-500 md:flex-row md:gap-8 md:items-center relative">
      {/* IMAGE CONTAINER */}
      {singleProduct.img && (
        <div className="relative w-full h-1/2 md:h-[70%]">
          <Image
            src={singleProduct.img}
            alt=""
            className="object-contain"
            fill
          />
          {/* Delete Button */}
          <div className="absolute top-0 right-0 p-2 flex items-center">
            <DeleteButton id={singleProduct.id} />
          </div>
        </div>
      )}
      {/* TEXT CONTAINER */}
      <div className="h-1/2 flex flex-col gap-4 md:h-[70%] md:justify-center md:gap-6 xl:gap-8">
        <h1 className="text-3xl font-bold uppercase">
          <span>{singleProduct.title}</span>
        </h1>
        <p className="mb-0">{singleProduct.desc}</p>  
        <h2 className="text-lg font-semibold mt-0">Base Price: {singleProduct.price}</h2>
        <div>
          <h2 className="text-lg font-semibold">Ingredients</h2>
          <ul>
            {singleProduct.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
        {session?.user.isAdmin ? null : (
          <>
            <Price product={singleProduct} />
          </>
        )}
      </div>
    </div>
  );  
  };
  
  export default SingleProductPage;