"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Pencil, Trash2, Plus, X, ToggleLeft, Loader2, ArrowLeft, Check } from "lucide-react";
import Link from "next/link";

export default function ServicesManagement() {
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    description: "",
    icon: "default-icon",
    content: "",
    coverImage: "",
    isActive: true
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  
  // Icons options (assuming these are the available icons in your app)
  const iconOptions = [
    "default-icon", 
    "calendar", 
    "users", 
    "settings", 
    "mail", 
    "help-circle", 
    "heart", 
    "shield", 
    "globe", 
    "phone"
  ];

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
      fetchServices();
    } catch (error) {
      localStorage.removeItem('user');
      router.push('/login');
    }
  }, [router]);

  // Fetch all services
  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/services');
      setServices(response.data.services || []);
      setError(null);
    } catch (err) {
      setError("Failed to fetch services: " + (err.response?.data?.error || err.message));
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  // Reset form data
  const resetFormData = () => {
    setFormData({
      slug: "",
      title: "",
      description: "",
      icon: "default-icon",
      content: "",
      coverImage: "",
      isActive: true
    });
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      // Handle file upload
      const file = files[0];
      if (file) {
        console.log("File selected:", file.name, file.size, file.type);
        
        // Check file size (limit to 5MB)
        if (file.size > 5 * 1024 * 1024) {
          showNotification("File size exceeds 5MB limit", "error");
          return;
        }
        
        const reader = new FileReader();
        reader.onloadend = () => {
          console.log("File read complete, setting coverImage data");
          setFormData({
            ...formData,
            [name]: reader.result
          });
        };
        reader.onerror = () => {
          showNotification("Error reading file", "error");
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  // Generate a slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove non-word chars
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/--+/g, '-') // Replace multiple - with single -
      .trim(); // Trim - from start and end
  };

  // Auto-generate slug when title changes
  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title)
    });
  };

  // Add a new service
  const handleAddService = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    
    try {
      console.log("Submitting form data:", formData);
      console.log("Cover image data length:", formData.coverImage ? formData.coverImage.length : 0);
      
      const response = await axios.post('/api/services', formData);
      setServices([...services, response.data.service]);
      setShowAddForm(false);
      resetFormData();
      showNotification("Service added successfully", "success");
    } catch (err) {
      showNotification("Failed to add service: " + (err.response?.data?.error || err.message), "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Update an existing service
  const handleUpdateService = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    
    try {
      console.log("Updating service with data:", formData);
      console.log("Cover image data length:", formData.coverImage ? formData.coverImage.length : 0);
      
      const response = await axios.put(`/api/services/id/${currentService._id}`, formData);
      
      // Update services array with the updated service
      setServices(services.map(service => 
        service._id === currentService._id ? response.data.service : service
      ));
      
      // Show notification and close modal
      showNotification("Service updated successfully", "success");
      setShowEditForm(false);
      setCurrentService(null);
    } catch (err) {
      console.error("Error updating service:", err);
      showNotification("Failed to update service: " + (err.response?.data?.error || err.message), "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete a service
  const handleDeleteService = async (serviceId) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    
    setActionLoading(true);
    
    try {
      console.log("Deleting service with ID:", serviceId);
      
      const response = await axios.delete(`/api/services/id/${serviceId}`);
      console.log("Delete response:", response.data);
      
      // Update services list by removing the deleted service
      setServices(services.filter(service => service._id !== serviceId));
      showNotification("Service deleted successfully", "success");
    } catch (err) {
      console.error("Error deleting service:", err);
      
      // Show detailed error information
      let errorMessage = "Failed to delete service";
      if (err.response) {
        errorMessage += `: ${err.response.data?.error || err.response.statusText || err.message}`;
        console.log("Error response data:", err.response.data);
        console.log("Error response status:", err.response.status);
      } else if (err.request) {
        errorMessage += ": No response received from server";
        console.log("Error request:", err.request);
      } else {
        errorMessage += `: ${err.message}`;
      }
      
      showNotification(errorMessage, "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle service active status
  const handleToggleActive = async (service) => {
    setActionLoading(true);
    
    try {
      const updatedService = { ...service, isActive: !service.isActive };
      console.log(`Toggling service '${service.title}' to ${!service.isActive ? 'active' : 'inactive'}`);
      
      const response = await axios.put(`/api/services/id/${service._id}`, updatedService);
      
      // Update services array with the updated service
      setServices(services.map(s => 
        s._id === service._id ? response.data.service : s
      ));
      
      showNotification(`Service ${response.data.service.isActive ? 'activated' : 'deactivated'} successfully`, "success");
    } catch (err) {
      console.error("Error toggling service status:", err);
      showNotification("Failed to update service status: " + (err.response?.data?.error || err.message), "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Open edit form with service data
  const handleEditClick = (service) => {
    setCurrentService(service);
    setFormData({
      slug: service.slug,
      title: service.title,
      description: service.description,
      icon: service.icon,
      content: service.content,
      coverImage: service.coverImage,
      isActive: service.isActive
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading services...</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Service Management</h1>
          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center shadow-sm transition"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Service
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

        {/* Service List */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {services.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No services found
                    </td>
                  </tr>
                ) : (
                  services.map((service) => (
                    <tr key={service._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{service.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{service.slug}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 truncate max-w-[200px]">
                          {service.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {service.coverImage ? (
                          <img 
                            src={service.coverImage} 
                            alt={service.title} 
                            className="h-12 w-12 object-cover rounded-md"
                          />
                        ) : (
                          <div className="h-12 w-12 bg-gray-200 flex items-center justify-center rounded-md">
                            <span className="text-xs text-gray-500">No image</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            service.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {service.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleEditClick(service)}
                            className="text-blue-600 hover:text-blue-900"
                            disabled={actionLoading}
                            title="Edit service"
                          >
                            <Pencil className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteService(service._id)}
                            className="text-red-600 hover:text-red-900"
                            disabled={actionLoading}
                            title="Delete service"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Service Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4">
              <h2 className="text-xl font-semibold">Add New Service</h2>
              <button onClick={() => setShowAddForm(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddService} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleTitleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Slug</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
                <p className="text-xs text-gray-500">URL-friendly name (auto-generated from title)</p>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                ></textarea>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Icon</label>
                <select
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  {iconOptions.map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Cover Image</label>
                <input
                  type="file"
                  name="coverImage"
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  accept="image/*"
                  required
                />
                {formData.coverImage && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
                    <img 
                      src={formData.coverImage} 
                      alt="Cover Preview" 
                      className="h-40 object-cover rounded border border-gray-300" 
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Content</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows="6"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                ></textarea>
                <p className="text-xs text-gray-500">Detailed content supports both English and Arabic text</p>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">Active</label>
              </div>
              
              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md mr-2"
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md flex items-center"
                  disabled={actionLoading}
                >
                  {actionLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                  Add Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Service Modal */}
      {showEditForm && currentService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4">
              <h2 className="text-xl font-semibold">Edit Service</h2>
              <button onClick={() => setShowEditForm(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleUpdateService} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleTitleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Slug</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                ></textarea>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Icon</label>
                <select
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  {iconOptions.map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Cover Image</label>
                <input
                  type="file"
                  name="coverImage"
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  accept="image/*"
                />
                {formData.coverImage && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
                    <img 
                      src={formData.coverImage} 
                      alt="Cover Preview" 
                      className="h-40 object-cover rounded border border-gray-300" 
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Content</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows="6"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                ></textarea>
                <p className="text-xs text-gray-500">Detailed content supports both English and Arabic text</p>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">Active</label>
              </div>
              
              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowEditForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md mr-2"
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md flex items-center"
                  disabled={actionLoading}
                >
                  {actionLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Check className="h-4 w-4 mr-2" />}
                  Update Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 