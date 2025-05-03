"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Pencil, Trash2, Plus, X, Check, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function UsersManagement() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
    isVerified: false
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
      fetchUsers();
    } catch (error) {
      localStorage.removeItem('user');
      router.push('/login');
    }
  }, [router]);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/users');
      setUsers(response.data.users);
      setError(null);
    } catch (err) {
      setError("Failed to fetch users: " + (err.response?.data?.error || err.message));
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

  // Add a new user
  const handleAddUser = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    
    try {
      const response = await axios.post('/api/users', formData);
      setUsers([...users, response.data.user]);
      setShowAddForm(false);
      setFormData({
        username: "",
        email: "",
        password: "",
        role: "user",
        isVerified: false
      });
      showNotification("User added successfully", "success");
    } catch (err) {
      showNotification("Failed to add user: " + (err.response?.data?.error || err.message), "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Update an existing user
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    
    try {
      const { password, ...updateData } = formData; // Remove password if it's empty
      const dataToUpdate = password ? formData : updateData;
      
      const response = await axios.put(`/api/users/${currentUser._id}`, dataToUpdate);
      
      // Update users array with the updated user
      setUsers(users.map(user => 
        user._id === currentUser._id ? response.data.user : user
      ));
      
      setShowEditForm(false);
      setCurrentUser(null);
      showNotification("User updated successfully", "success");
    } catch (err) {
      showNotification("Failed to update user: " + (err.response?.data?.error || err.message), "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete a user
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    
    setActionLoading(true);
    
    try {
      await axios.delete(`/api/users/${userId}`);
      setUsers(users.filter(user => user._id !== userId));
      showNotification("User deleted successfully", "success");
    } catch (err) {
      showNotification("Failed to delete user: " + (err.response?.data?.error || err.message), "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Open edit form with user data
  const handleEditClick = (user) => {
    setCurrentUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: "", // Don't include the current password
      role: user.role,
      isVerified: user.isVerified
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
          <p className="mt-4 text-gray-600">Loading users...</p>
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
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center shadow-sm transition"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New User
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

        {/* Users List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {error ? (
            <div className="p-6 text-red-500">{error}</div>
          ) : users.length === 0 ? (
            <div className="p-6 text-gray-500">No users found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verified</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.username}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.isVerified ? (
                          <span className="text-green-600"><Check className="h-5 w-5" /></span>
                        ) : (
                          <span className="text-red-600"><X className="h-5 w-5" /></span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => handleEditClick(user)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                          disabled={actionLoading}
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user._id)}
                          className="text-red-600 hover:text-red-900"
                          disabled={actionLoading}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Add New User</h2>
              <button 
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddUser}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
                  />
                </div>
                
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isVerified"
                    name="isVerified"
                    checked={formData.isVerified}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isVerified" className="ml-2 block text-sm text-gray-700">
                    Verified Account
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
                    <>Add User</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditForm && currentUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Edit User</h2>
              <button 
                onClick={() => setShowEditForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleUpdateUser}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="edit-username" className="block text-sm font-medium text-gray-700">Username</label>
                  <input
                    type="text"
                    id="edit-username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    id="edit-email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-password" className="block text-sm font-medium text-gray-700">
                    Password <span className="text-xs text-gray-500">(Leave empty to keep current)</span>
                  </label>
                  <input
                    type="password"
                    id="edit-password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-role" className="block text-sm font-medium text-gray-700">Role</label>
                  <select
                    id="edit-role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="edit-isVerified"
                    name="isVerified"
                    checked={formData.isVerified}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="edit-isVerified" className="ml-2 block text-sm text-gray-700">
                    Verified Account
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
                    <>Update User</>
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