"use client";  // Add this line at the top to mark the component as client-side

import React, { useState, useEffect } from "react";

// Fallback FAQs data in case the API fails
const fallbackFaqs = [
  {
    question: "How does Mawaddah work?",
    answer: "Mawaddah connects people looking for marriage based on values and compatibility.",
    category: "general"
  },
  {
    question: "Is Mawaddah free to use?",
    answer: "Yes, basic features are free. Premium plans offer more benefits.",
    category: "general"
  },
  {
    question: "How can I verify my profile?",
    answer: "You can verify by uploading a valid ID and submitting a short video.",
    category: "account"
  },
];

const FAQs = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userQuestion, setUserQuestion] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState(["all"]);
  const [testStatus, setTestStatus] = useState(null);

  // Fetch FAQs from API
  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoading(true);

        // Try using native fetch instead of axios
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || window.location.origin;
        console.log("🔍 Using fetch to test API:", `${baseUrl}/api/test`);
        
        try {
          // First try the test API
          const testResponse = await fetch(`${baseUrl}/api/test`);
          if (!testResponse.ok) {
            throw new Error(`API test failed with status: ${testResponse.status}`);
          }
          const testData = await testResponse.json();
          console.log("✅ API test successful:", testData);
          
          // Now try the actual FAQs endpoint
          console.log("🔍 Fetching FAQs with fetch:", `${baseUrl}/api/faqs`);
          const faqsResponse = await fetch(`${baseUrl}/api/faqs${selectedCategory !== "all" ? `?category=${selectedCategory}` : ''}`);
          
          if (!faqsResponse.ok) {
            throw new Error(`FAQ API failed with status: ${faqsResponse.status}`);
          }
          
          const faqsData = await faqsResponse.json();
          console.log("✅ FAQs data retrieved:", faqsData);
          
          // Use the faqs array from the response
          const retrievedFaqs = faqsData.faqs || [];
          
          if (retrievedFaqs.length > 0) {
            setFaqs(retrievedFaqs);
            // Extract unique categories
            const uniqueCategories = ["all", ...new Set(retrievedFaqs.map(faq => faq.category))];
            setCategories(uniqueCategories);
          } else {
            console.log("⚠️ No FAQs returned, using fallback data");
            setFaqs(fallbackFaqs);
            const uniqueCategories = ["all", ...new Set(fallbackFaqs.map(faq => faq.category))];
            setCategories(uniqueCategories);
          }
        } catch (fetchError) {
          console.error("❌ Fetch error:", fetchError);
          console.log("⚠️ Using fallback data due to fetch error");
          setFaqs(fallbackFaqs);
          const uniqueCategories = ["all", ...new Set(fallbackFaqs.map(faq => faq.category))];
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error("❌ Overall error in fetchFAQs:", error);
        setFaqs(fallbackFaqs);
        const uniqueCategories = ["all", ...new Set(fallbackFaqs.map(faq => faq.category))];
        setCategories(uniqueCategories);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, [selectedCategory]);

  const toggleAnswer = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    if (!userQuestion.trim()) return;
    
    // Here you would typically send the question to your backend
    alert(`Thank you for your question: "${userQuestion}". We'll get back to you soon!`);
    setUserQuestion("");
  };

  // Manual test function
  const testApiConnection = async () => {
    setTestStatus("Testing...");
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || window.location.origin;
      const testUrl = `${baseUrl}/api/test`;
      console.log("🔍 Manual test - fetching:", testUrl);
      
      const response = await fetch(testUrl);
      if (!response.ok) {
        throw new Error(`API test failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("✅ Manual test successful:", data);
      setTestStatus("Success: " + JSON.stringify(data));
    } catch (error) {
      console.error("❌ Manual test failed:", error);
      setTestStatus("Error: " + error.message);
    }
  };

  return (
    <section className="bg-white py-10">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">Frequently Asked Questions</h2>
        
        
        {/* Category filter */}
        <div className="flex flex-wrap justify-center mb-6 space-x-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-blue-100 text-blue-800 hover:bg-blue-200"
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
        
        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-2 text-gray-600">Loading FAQs...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-blue-50 p-6 rounded-lg shadow hover:shadow-md transition duration-300">
                <div
                  className="text-lg font-semibold text-blue-800 cursor-pointer flex justify-between items-center"
                  onClick={() => toggleAnswer(index)}
                >
                  <span>{faq.question}</span>
                  <span className="text-xl">{activeIndex === index ? "−" : "+"}</span>
                </div>
                {activeIndex === index && (
                  <p className="text-gray-700 mt-2">{faq.answer}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* User Custom Question Section */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold text-center text-blue-700 mb-4">Have a Question? Ask Us!</h3>
          <form className="flex flex-col items-center space-y-4" onSubmit={handleSubmitQuestion}>
            <textarea
              placeholder="Ask your question here..."
              className="w-full md:w-2/3 p-4 border border-gray-300 rounded-md"
              rows="4"
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-800 transition duration-300"
            >
              Submit Question
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default FAQs;
