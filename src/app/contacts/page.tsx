import React from "react";

const Contact = () => {
  return (
    <div className="container mx-auto mt-8 mb-10 p-4 lg:px-20 xl:px-40">
      <h1 className="text-3xl font-bold mb-8 text-red-500">Contact Us</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-blue-50 p-6 rounded-lg shadow-md border border-red-500">
          <h2 className="text-xl font-semibold mb-2 text-red-500">Our Address</h2>
          <p className="text-lg text-gray-700">123 Main Street</p>
          <p className="text-lg text-gray-700">City, State, ZIP</p>
          <p className="text-lg text-gray-700">Country</p>
        </div>
        <div className="bg-blue-50 p-6 rounded-lg shadow-md border border-red-500">
          <h2 className="text-xl font-semibold mb-2 text-red-500">Phone Numbers</h2>
          <p className="text-lg text-gray-700">123-456-78</p>
          <p className="text-lg text-gray-700">123-456-98</p>
        </div>
      </div>
      <div className="mt-8 bg-blue-50 p-6 rounded-lg shadow-md border border-red-500">
        <p className="text-lg text-gray-800 mb-2">For inquiries and support, please email us at:</p>
        <a href="mailto:info@restaurant.com" className="text-blue-500 font-semibold">info@restaurant.com</a>
      </div>
    </div>
  );  
};

export default Contact;