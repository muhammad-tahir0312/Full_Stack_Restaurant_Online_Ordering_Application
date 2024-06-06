"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface ProductInput {
  title: string;
  desc: string;
  price: number;
  catSlug: string;
  ingredients: string[];
  options: Option[];
}

interface Option {
  title: string;
  additionalPrice: number;
}

interface Ingredient {
  id: string;
  name: string;
}
const AddPage = () => {
  const router = useRouter();

  const [productInput, setProductInput] = useState<ProductInput>({
    title: "",
    desc: "",
    price: 0,
    catSlug: "",
    ingredients: [],
    options: [],
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [priceError, setPriceError] = useState<string>("");
  const [additionalPriceError, setAdditionalPriceError] = useState<string>("");
  const [categories, setCategories] = useState<{ id: string; title: string; slug: string }[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [newIngredient, setNewIngredient] = useState<string>("");
  const [filteredIngredients, setFilteredIngredients] = useState<Ingredient[]>([]);
  const [newOption, setNewOption] = useState<Option>({
    title: "",
    additionalPrice: 0,
  });
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/categories");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    const fetchIngredients = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/products2");
        const products = await res.json();
        const allIngredients: string[] = products.reduce((acc: string[], product: any) => {
          return acc.concat(product.ingredients);
        }, []);
        const uniqueIngredients = [...new Set(allIngredients)];
        setIngredients(uniqueIngredients.map((name) => ({ id: name, name })));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };  
    
    fetchCategories();
    fetchIngredients();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProductInput((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "price" && parseFloat(value) < 0) {
      setPriceError("Price cannot be negative.");
    } else {
      setPriceError("");
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProductInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const item = e.target.files?.[0];
    setSelectedFile(item || null);
    // Set image preview
    if (item) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(item);
    } else {
      setImagePreview(null);
    }
  };

  const handleIngredientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = e.target;
    if (checked) {
      setProductInput((prev) => ({
        ...prev,
        ingredients: [...prev.ingredients, value],
      }));
    } else {
      setProductInput((prev) => ({
        ...prev,
        ingredients: prev.ingredients.filter((ingredient) => ingredient !== value),
      }));
    }
  };

  const handleAddNewIngredient = () => {
    if (newIngredient && !ingredients.some((ingredient) => ingredient.name === newIngredient)) {
      setIngredients((prev) => [...prev, { id: newIngredient, name: newIngredient }]);
      setNewIngredient("");
    }
  };

  const changeOption = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewOption((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "additionalPrice" && parseFloat(value) < 0) {
      setAdditionalPriceError("Additional price cannot be negative.");
    } else {
      setAdditionalPriceError("");
    }
  };

  const addOption = () => {
    if (
      newOption.title &&
      newOption.additionalPrice >= 0 &&
      !productInput.options.some((option) => option.title === newOption.title)
    ) {
      setProductInput((prev) => ({
        ...prev,
        options: [...prev.options, { ...newOption }],
      }));
      setNewOption({
        title: "",
        additionalPrice: 0,
      });
    }
  };

  const removeOption = (title: string) => {
    setProductInput((prev) => ({
      ...prev,
      options: prev.options.filter((option) => option.title !== title),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;

    // Validation
    if (!productInput.title || !productInput.desc || !productInput.price || !productInput.catSlug) {
      alert("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      // const img = selectedFile ? URL.createObjectURL(selectedFile) : "";
      const img = "/" + selectedFile?.name;

      const res = await fetch("http://localhost:3000/api/products", {
        method: "POST",
        body: JSON.stringify({
          img,
          ...productInput,
        }),
      });

      const data = await res.json();

      router.push(`/product/${data.id}`);
    } catch (err) {
      console.error("Error submitting product:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearch = () => {
    // Perform the search based on the searchQuery
    // For example, you can filter the ingredients based on the searchQuery
    const filteredIngredients = ingredients.filter(ingredient =>
      ingredient.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // Update the state with the filteredIngredients
    // Assuming you have a state variable to store filteredIngredients
    setFilteredIngredients(filteredIngredients);
  };  

  const AllIngredients = ingredients.filter(ingredient =>
    ingredient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 lg:px-20 xl:px-40 min-h-screen flex flex-col items-center justify-center text-red-500">
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-6">
        <h1 className="text-4xl mb-2 text-red-500 font-bold">Add New Product</h1>
        <div className="w-full flex flex-col gap-2">
          <label className="text-sm cursor-pointer flex gap-4 items-center text-black" htmlFor="file">
            <Image src="/upload.png" alt="" width={30} height={20} />
            <span>Upload Image</span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleChangeImg}
            id="file"
            className="hidden"
          />
          {imagePreview && (
            <div className="mt-2 flex flex-col items-left ring-1 ring-red-200 p-4 rounded-sm outline-none justify-left gap-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-black">Preview</p>
                <button className="text-red-500" onClick={() => setImagePreview(null)}>Delete</button>
              </div>
              <Image src={imagePreview} alt="Preview" width={350} height={200} />
            </div>
          )}
        </div>
        <div className="w-full flex flex-col gap-2">
          <label className="text-sm text-black">Title</label>
          <input
            className="ring-1 ring-red-200 p-4 rounded-sm outline-none"
            type="text"
            placeholder="Bella Napoli"
            name="title"
            onChange={handleChange}
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <label className="text-sm text-black">Description</label>
          <textarea
            rows={3}
            className="ring-1 ring-red-200 p-4 rounded-sm outline-none"
            placeholder="A timeless favorite with a twist, showcasing a thin crust topped with sweet tomatoes, fresh basil and creamy mozzarella."
            name="desc"
            onChange={handleChange}
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <label id="price-label" className="text-sm text-black">Price</label>
          <input
            className="ring-1 ring-red-200 p-4 rounded-sm outline-none"
            type="number"
            id="price"
            placeholder="29"
            name="price"
            aria-labelledby="price-label"
            onChange={handleChange}
            min="1"
          />
          {priceError && <p className="text-red-500">{priceError}</p>}
        </div>
        <div className="w-full flex flex-col gap-2">
          <label className="text-sm text-black">Category</label>
          <select
            className="ring-1 ring-red-200 p-4 rounded-sm outline-none"
            name="catSlug"
            onChange={handleCategoryChange}
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.title}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full flex flex-col gap-2">
          <label className="text-sm text-black">Options</label>
          <div className="flex">
            <input
              className="ring-1 ring-red-200 p-4 rounded-sm outline-none"
              type="text"
              placeholder="Title"
              name="title"
              value={newOption.title}
              onChange={changeOption}
            />
            <input
              className="ring-1 ring-red-200 p-4 rounded-sm outline-none"
              type="number"
              placeholder="Additional Price"
              name="additionalPrice"
              value={newOption.additionalPrice}
              onChange={changeOption}
              min="0"
            />
            {additionalPriceError && <p className="text-red-500">{additionalPriceError}</p>}
            <button
              type="button"
              className="bg-red-500 text-white p-4 rounded-sm flex-none hover:bg-black transition duration-300"
              onClick={addOption}
            >
              Add Option
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
              {productInput.options.map((option, index) => (
                <div key={index} className="flex items-center justify-between w-full">
                  <p>{option.title} (+${option.additionalPrice})</p>
                  <button onClick={() => removeOption(option.title)}>Delete</button>
                </div>
              ))}
            </div>
          </div>     
        <div className="w-full flex flex-col gap-2">
          <label className="text-sm text-black">Ingredients</label>
          <div className="flex gap-2">
            {/* Search Ingredients */}
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                placeholder="Search ingredients"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ring-1 ring-red-200 p-4 rounded-sm outline-none flex-grow"
              />
              <button onClick={handleSearch} className="bg-red-500 text-white p-4 rounded-sm flex-none hover:bg-black transition duration-300">Search</button>
            </div>
            {/* Add New Ingredient */}
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                placeholder="Add new ingredient"
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                className="ring-1 ring-red-200 p-4 rounded-sm outline-none flex-grow"
              />
              <button type="button" onClick={handleAddNewIngredient} className="bg-red-500 text-white p-4 rounded-sm flex-none hover:bg-black transition duration-300">Add</button>
            </div>
          </div>
          {/* List of Ingredients */}
          <div className="grid grid-cols-5 gap-4 p-4">
            {AllIngredients.map((ingredient) => (
              <div key={ingredient.id} className="flex items-center space-x-2">
                <input
                  id={`ingredient-${ingredient.id}`}
                  type="checkbox"
                  value={ingredient.name}
                  className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  checked={productInput.ingredients.includes(ingredient.name)}
                  onChange={handleIngredientChange}
                />
                <label htmlFor={`ingredient-${ingredient.id}`} className="block text-sm font-medium text-gray-700 cursor-pointer">
                  {ingredient.name}
                </label>
              </div>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className={`bg-red-500 p-4 text-white w-48 rounded-md relative h-14 flex items-center justify-center hover:bg-black transition duration-300 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AddPage;