"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Pencil, Trash2, Plus, X, Loader2, ArrowLeft, ChevronUp, ChevronDown } from "lucide-react";
import Link from "next/link";

export default function FAQsManagement() {
  const router = useRouter();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentFAQ, setCurrentFAQ] = useState(null);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "general",
    isActive: true,
    order: 0
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  // Check if the user is admin on component mount
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'admin') {
        router.push('/');
        return;
      }
      fetchFAQs();
    } catch (error) {
      localStorage.removeItem('user');
      router.push('/login');
    }
  }, [router]);

  // Fetch all FAQs
  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/faqs');
      // Sort FAQs by category and then by order
      const sortedFAQs = response.data.faqs.sort((a, b) => {
        if (a.category !== b.category) {
          return a.category.localeCompare(b.category);
        }
        return a.order - b.order;
      });
      
      setFaqs(sortedFAQs);
      setError(null);
    } catch (err) {
      setError("Failed to fetch FAQs: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Add a new FAQ
  const handleAddFAQ = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    
    try {
      const response = await axios.post('/api/faqs', formData);
      setFaqs([...faqs, response.data.faq]);
      setShowAddForm(false);
      setFormData({
        question: "",
        answer: "",
        category: "general",
        isActive: true,
        order: 0
      });
      showNotification("FAQ added successfully", "success");
    } catch (err) {
      showNotification("Failed to add FAQ: " + (err.response?.data?.error || err.message), "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Update an existing FAQ
  const handleUpdateFAQ = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    
    try {
      const response = await axios.put(`/api/faqs/${currentFAQ._id}`, formData);
      
      // Update FAQs array with the updated FAQ
      setFaqs(faqs.map(faq => 
        faq._id === currentFAQ._id ? response.data.faq : faq
      ));
      
      setShowEditForm(false);
      setCurrentFAQ(null);
      showNotification("FAQ updated successfully", "success");
    } catch (err) {
      showNotification("Failed to update FAQ: " + (err.response?.data?.error || err.message), "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete a FAQ
  const handleDeleteFAQ = async (faqId) => {
    if (!window.confirm("Are you sure you want to delete this FAQ?")) return;
    
    setActionLoading(true);
    
    try {
      await axios.delete(`/api/faqs/${faqId}`);
      setFaqs(faqs.filter(faq => faq._id !== faqId));
      showNotification("FAQ deleted successfully", "success");
    } catch (err) {
      showNotification("Failed to delete FAQ: " + (err.response?.data?.error || err.message), "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Move FAQ up in order
  const handleMoveUp = async (faq) => {
    const sameCategoryFaqs = faqs.filter(f => f.category === faq.category);
    const currentIndex = sameCategoryFaqs.findIndex(f => f._id === faq._id);
    
    if (currentIndex <= 0) return; // Already at the top
    
    const newOrder = sameCategoryFaqs[currentIndex - 1].order;
    const prevFaqId = sameCategoryFaqs[currentIndex - 1]._id;
    
    setActionLoading(true);
    
    try {
      // Update current FAQ order
      await axios.put(`/api/faqs/${faq._id}`, {
        ...faq,
        order: newOrder
      });
      
      // Update previous FAQ order
      await axios.put(`/api/faqs/${prevFaqId}`, {
        ...sameCategoryFaqs[currentIndex - 1],
        order: faq.order
      });
      
      // Refetch FAQs to get the updated order
      fetchFAQs();
    } catch (err) {
      showNotification("Failed to reorder FAQs: " + (err.response?.data?.error || err.message), "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Move FAQ down in order
  const handleMoveDown = async (faq) => {
    const sameCategoryFaqs = faqs.filter(f => f.category === faq.category);
    const currentIndex = sameCategoryFaqs.findIndex(f => f._id === faq._id);
    
    if (currentIndex >= sameCategoryFaqs.length - 1) return; // Already at the bottom
    
    const newOrder = sameCategoryFaqs[currentIndex + 1].order;
    const nextFaqId = sameCategoryFaqs[currentIndex + 1]._id;
    
    setActionLoading(true);
    
    try {
      // Update current FAQ order
      await axios.put(`/api/faqs/${faq._id}`, {
        ...faq,
        order: newOrder
      });
      
      // Update next FAQ order
      await axios.put(`/api/faqs/${nextFaqId}`, {
        ...sameCategoryFaqs[currentIndex + 1],
        order: faq.order
      });
      
      // Refetch FAQs to get the updated order
      fetchFAQs();
    } catch (err) {
      showNotification("Failed to reorder FAQs: " + (err.response?.data?.error || err.message), "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Open edit form with FAQ data
  const handleEditClick = (faq) => {
    setCurrentFAQ(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      isActive: faq.isActive,
      order: faq.order
    });
    setShowEditForm(true);
  };

  // Display notification
  const showNotification = (message, type) => {
    setNotification({
      show: true,
      message,
      type
    });
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  // Group FAQs by category
  const groupedFAQs = faqs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading FAQs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <div className="mb-6">
          <Link href="/admin/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">FAQ Management</h1>
          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center shadow-sm transition"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New FAQ
          </button>
        </div>

        {/* Notification */}
        {notification.show && (
          <div className={`mb-6 p-4 rounded-md ${
            notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          } flex justify-between items-center`}>
            <p>{notification.message}</p>
            <button 
              onClick={() => setNotification({ show: false, message: "", type: "" })}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* FAQs List */}
        <div className="space-y-6">
          {error ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-red-500">{error}</div>
          ) : Object.keys(groupedFAQs).length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-gray-500">No FAQs found.</div>
          ) : (
            Object.entries(groupedFAQs).map(([category, categoryFaqs]) => (
              <div key={category} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900 capitalize">{category}</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {categoryFaqs.map((faq) => (
                    <div key={faq._id} className="p-6 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div className={`flex-1 ${!faq.isActive ? 'opacity-50' : ''}`}>
                          <h3 className="text-md font-medium text-gray-900">{faq.question}</h3>
                          <p className="mt-1 text-sm text-gray-600">{faq.answer}</p>
                        </div>
                        <div className="flex items-center ml-4">
                          <div className="flex flex-col mr-4">
                            <button 
                              onClick={() => handleMoveUp(faq)}
                              className="text-gray-500 hover:text-gray-700 mb-1"
                              disabled={actionLoading}
                            >
                              <ChevronUp className="h-5 w-5" />
                            </button>
                            <button 
                              onClick={() => handleMoveDown(faq)}
                              className="text-gray-500 hover:text-gray-700"
                              disabled={actionLoading}
                            >
                              <ChevronDown className="h-5 w-5" />
                            </button>
                          </div>
                          <button 
                            onClick={() => handleEditClick(faq)}
                            className="text-blue-600 hover:text-blue-900 mr-2"
                            disabled={actionLoading}
                          >
                            <Pencil className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={() => handleDeleteFAQ(faq._id)}
                            className="text-red-600 hover:text-red-900"
                            disabled={actionLoading}
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center text-xs text-gray-500">
                        <span className={`mr-4 px-2 py-1 rounded ${faq.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                          {faq.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span>Order: {faq.order}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add FAQ Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Add New FAQ</h2>
              <button 
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddFAQ}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="question" className="block text-sm font-medium text-gray-700">Question</label>
                  <input
                    type="text"
                    id="question"
                    name="question"
                    value={formData.question}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
                  />
                </div>
                
                <div>
                  <label htmlFor="answer" className="block text-sm font-medium text-gray-700">Answer</label>
                  <textarea
                    id="answer"
                    name="answer"
                    value={formData.answer}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
                  />
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
                  />
                </div>
                
                <div>
                  <label htmlFor="order" className="block text-sm font-medium text-gray-700">Order</label>
                  <input
                    type="number"
                    id="order"
                    name="order"
                    value={formData.order}
                    onChange={handleChange}
                    min={0}
                    className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                    Active
                  </label>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Adding...
                    </>
                  ) : (
                    <>Add FAQ</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit FAQ Modal */}
      {showEditForm && currentFAQ && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Edit FAQ</h2>
              <button 
                onClick={() => setShowEditForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleUpdateFAQ}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="edit-question" className="block text-sm font-medium text-gray-700">Question</label>
                  <input
                    type="text"
                    id="edit-question"
                    name="question"
                    value={formData.question}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-answer" className="block text-sm font-medium text-gray-700">Answer</label>
                  <textarea
                    id="edit-answer"
                    name="answer"
                    value={formData.answer}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-category" className="block text-sm font-medium text-gray-700">Category</label>
                  <input
                    type="text"
                    id="edit-category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-order" className="block text-sm font-medium text-gray-700">Order</label>
                  <input
                    type="number"
                    id="edit-order"
                    name="order"
                    value={formData.order}
                    onChange={handleChange}
                    min={0}
                    className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="edit-isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="edit-isActive" className="ml-2 block text-sm text-gray-700">
                    Active
                  </label>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Updating...
                    </>
                  ) : (
                    <>Update FAQ</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 