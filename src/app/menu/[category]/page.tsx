"use client";

import React, { useState, useEffect } from "react";
import { ProductType } from "../../../types/types";
import Image from "next/image";
import Link from "next/link";

const getData = async (category: string) => {
  const res = await fetch(`http://localhost:3000/api/products?cat=${category}`, {
    cache: "no-store"
  });

  if (!res.ok) {
    throw new Error("Failed!");
  }

  return res.json();
};

type Props = {
  params: { category: string };
};

const CategoryPage = ({ params }: Props) => {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [allIngredients, setAllIngredients] = useState<string[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");  
  const [products, setProducts] = useState<ProductType[]>([]);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(true); // State to track loading state

  const handleIngredientSelection = (ingredient: string) => {
    if (selectedIngredients.includes(ingredient)) {
      setSelectedIngredients(selectedIngredients.filter(item => item !== ingredient));
    } else {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
  };  

  const handleDoneClick = () => {
    if (selectedIngredients.length === 0) {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product =>
        selectedIngredients.every(ingredient => product.ingredients.includes(ingredient))
      ));
    }
  };  

  const handleClearClick = () => {
    setSelectedIngredients([]);
    setFilteredProducts(products);
    setSearchTerm("");
  };  

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getData(params.category);
        setProducts(data);

        const ingredients = new Set<string>();
        data.forEach((product: ProductType) => {
          if (product.ingredients) {
            product.ingredients.forEach(ingredient => {
              ingredients.add(ingredient);
            });
          }
        });
        const allIngredientsArray = Array.from(ingredients) as string[];
        setAllIngredients(allIngredientsArray);
        setSearchResults(allIngredientsArray.filter((ingredient) => ingredient.toLowerCase().includes(searchTerm.toLowerCase())));
        
        if (selectedIngredients.length === 0) {
          setFilteredProducts(data);
        } else {
          setFilteredProducts(data.filter((product: ProductType) => 
            selectedIngredients.every(ingredient => product.ingredients?.includes(ingredient))
          ));
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [params.category, searchTerm, selectedIngredients]);

  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-red-500 text-white p-4 overflow-y-auto">
        <div className="mb-4">
          <h2 className="text-center mb-2">Select Ingredients</h2>
          <input
            type="text"
            placeholder="Search ingredients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 m-1 bg-white text-red-500 w-full rounded-md"
          />
          {searchResults.map((ingredient) => (
            <label key={ingredient} className="block">
              <input
                type="checkbox"
                checked={selectedIngredients.includes(ingredient)}
                onChange={() => handleIngredientSelection(ingredient)}
                className="mr-2 cursor-pointer"
              />
              {ingredient}
            </label>
          ))}
        </div>
        <div className="flex justify-center space-x-4">
          <button onClick={handleDoneClick} className="p-2 bg-white text-red-500 rounded-md">Done</button>
          <button onClick={handleClearClick} className="p-2 bg-white text-red-500 rounded-md">Clear</button>
        </div>
      </div>
      <div className="w-3/4 flex flex-wrap overflow-y-auto">
        {filteredProducts.length === 0 ? (
          <div className="w-full text-center p-8">
            <p className="text-lg">No products found.</p>
          </div>
        ) : (
          filteredProducts.map((product: ProductType) => (
            <Link href={`/product/${product.id}`} key={product.id} className="w-1/2 p-4">
              <div className="border-b border-gray-200">
                <h2 className="text-xl mb-2">{product.title}</h2>
                <div className="relative w-32 h-32 mb-2 overflow-hidden">
                  <Image src={product.img || 'default_image_path'} alt="" layout="fill" objectFit="contain" />
                </div>
                <p className="text-lg mb-2">${product.price}</p>
                {product.ingredients && (
                  <div>
                    <h3 className="mb-1">Ingredients:</h3>
                    <div className="flex flex-wrap">
                      {product.ingredients.map((ingredient, index) => (
                        <button
                          key={ingredient}
                          onClick={() => handleIngredientSelection(ingredient)}
                          className="mr-2 mb-2 bg-red-500 text-white p-1 rounded-md"
                        >
                          {ingredient}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );  
};

export default CategoryPage;