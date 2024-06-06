"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface CategoryInput {
  title: string;
  desc: string;
  slug: string;
  color: string;
}

const AddCategoryPage = () => {
  const router = useRouter();

  const [categoryInput, setCategoryInput] = useState<CategoryInput>({
    title: "",
    desc: "",
    slug: "",
    color: "white",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCategoryInput((prev) => ({
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!categoryInput.title || !categoryInput.desc || !categoryInput.slug) {
      alert("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      // const img = selectedFile ? URL.createObjectURL(selectedFile) : "";
      const img = "/" + selectedFile?.name;
    
      // console.log(a);
      
      const res = await fetch("http://localhost:3000/api/categories", {
        method: "POST",
        body: JSON.stringify({
          img,
          ...categoryInput,
        }),
      });
      router.push(`/`);
    } catch (err) {
      console.error("Error submitting category:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 lg:px-20 xl:px-40 min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-700">
      <form onSubmit={handleSubmit} className="w-full h-200 max-w-3xl bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-4xl mb-6 font-bold text-red-500 text-center">Add New Category</h1>
        <div className="w-full mb-4">
          <label htmlFor="file" className="flex items-center cursor-pointer gap-2 text-sm font-medium text-gray-700">
            <div className="shrink-0">
              <Image src="/upload.png" alt="Upload" width={24} height={24} />
            </div>
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
            <div className="mt-4 p-4 border border-red-200 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-gray-700">Preview</p>
                <button type="button" className="text-red-500 hover:text-red-600" onClick={() => setImagePreview(null)}>Remove</button>
              </div>
              <Image src={imagePreview} alt="Preview" width={350} height={200} />
            </div>
          )}
        </div>
        <div className="w-full mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            id="title"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
            type="text"
            placeholder="Category Title"
            name="title"
            onChange={handleChange}
          />
        </div>
        <div className="w-full mb-4">
          <label htmlFor="desc" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="desc"
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
            placeholder="Category Description"
            name="desc"
            onChange={handleChange}
          />
        </div>
        <div className="w-full mb-6">
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700">Slug</label>
          <input
            id="slug"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
            type="text"
            placeholder="category-slug"
            name="slug"
            onChange={handleChange}
          />
        </div>
        <button
          type="submit"
          className={`w-full bg-red-500 p-3 text-white rounded-md hover:bg-black focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-300 ${
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

export default AddCategoryPage;