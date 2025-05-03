"use client";

import { useState } from "react";

export default function Portfolios() {
  const [experiences, setExperiences] = useState([
    { id: 1, type: "Local", category: "Website" },
    { id: 2, type: "Local", category: "Website" },
    { id: 3, type: "Local", category: "Website" },
    { id: 4, type: "Local", category: "Website" },
    { id: 5, type: "Local", category: "Website" },
    { id: 6, type: "Local", category: "Website" },
  ]);

  const [form, setForm] = useState({
    projectType: "",
    clientName: "",
    projectLanguage: "",
    previewURL: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add new experience
  const addExperience = () => {
    if (form.projectType && form.clientName && form.projectLanguage) {
      setExperiences([
        ...experiences,
        {
          id: experiences.length + 1,
          type: form.projectType,
          category: form.projectLanguage,
        },
      ]);
      setForm({ projectType: "", clientName: "", projectLanguage: "", previewURL: "" });
    }
  };

  // Delete experience
  const deleteExperience = (id) => {
    setExperiences(experiences.filter((exp) => exp.id !== id));
  };

  return (
    <div className="p-6 text-white bg-black min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Portfolios</h1>

      {/* Form Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Portfolios</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="projectType"
            value={form.projectType}
            onChange={handleChange}
            placeholder="Enter Project Type"
            className="p-2 rounded bg-gray-800 text-white w-full"
          />
          <input
            type="text"
            name="clientName"
            value={form.clientName}
            onChange={handleChange}
            placeholder="Enter Client Name"
            className="p-2 rounded bg-gray-800 text-white w-full"
          />
          <input
            type="text"
            name="projectLanguage"
            value={form.projectLanguage}
            onChange={handleChange}
            placeholder="Enter Project Language"
            className="p-2 rounded bg-gray-800 text-white w-full"
          />
          <input
            type="text"
            name="previewURL"
            value={form.previewURL}
            onChange={handleChange}
            placeholder="Enter Preview (URL)"
            className="p-2 rounded bg-gray-800 text-white w-full"
          />
        </div>

        {/* File Upload */}
        <div className="border-dashed border-2 border-orange-500 p-6 text-center mt-4">
          Click or Drag to upload an image 1:1
        </div>

        {/* Add Experience Button */}
        <button
          onClick={addExperience}
          className="bg-orange-500 text-white px-4 py-2 mt-4 rounded w-full md:w-auto"
        >
          Add Experience
        </button>
      </div>

      {/* Experiences List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Experiences</h2>
        <div className="bg-gray-900 p-4 rounded-lg">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="flex justify-between items-center border-b border-gray-700 py-2"
            >
              <span>{exp.id}</span>
              <span>{exp.type}</span>
              <span>{exp.category}</span>
              <button
                onClick={() => deleteExperience(exp.id)}
                className="text-red-500"
              >
                🗑
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
