"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dynamic from "next/dynamic";

// Import ReactQuill dynamically with no SSR
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>
});

// Import Quill styles only on client side
const QuillStyles = () => {
  useEffect(() => {
    import('react-quill/dist/quill.snow.css');
  }, []);
  return null;
};

export default function BlogsAdmin() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/blogs");
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch blogs");
      }
      
      setBlogs(data.blogs || []);
    } catch (error) {
      toast.error(error.message || "Error loading blogs");
      console.error("Error loading blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteBlog = (slug) => {
    setConfirmDelete(slug);
  };

  const handleDelete = async (slug) => {
    try {
      const response = await fetch(`/api/blogs/${slug}`, {
        method: "DELETE"
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to delete blog");
      }
      
      fetchBlogs();
      toast.success("Blog deleted successfully!");
    } catch (error) {
      toast.error(error.message || "Error deleting blog");
      console.error("Error deleting blog:", error);
    } finally {
      setConfirmDelete(null);
    }
  };

  return (
    <div className="p-6">
      <ToastContainer />
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Blogs</h1>
        <Link
          href="/admin/blogs/new"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaPlus /> Add New Blog
        </Link>
      </div>
      
      {/* Blogs List */}
      {loading ? (
        <div className="text-center py-10">Loading blogs...</div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No blogs found. Create your first blog!</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {blogs.map((blog) => (
                <tr key={blog._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{blog.title}</div>
                    <div className="text-sm text-gray-500">{blog.slug}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{blog.author}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        blog.isPublished
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {blog.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {confirmDelete === blog.slug ? (
                      <div className="flex justify-end items-center gap-2">
                        <span className="text-sm text-red-600 mr-2">Confirm?</span>
                        <button
                          onClick={() => handleDelete(blog.slug)}
                          className="text-white bg-red-600 hover:bg-red-700 p-1 rounded"
                          title="Confirm Delete"
                        >
                          <FaCheck size={14} />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="text-white bg-gray-600 hover:bg-gray-700 p-1 rounded"
                          title="Cancel"
                        >
                          <FaTimes size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end items-center gap-2">
                        <Link
                          href={`/admin/blogs/edit/${blog.slug}`}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit"
                        >
                          <FaEdit size={18} />
                        </Link>
                        <button
                          onClick={() => confirmDeleteBlog(blog.slug)}
                          className="text-red-600 hover:text-red-900 ml-4"
                          title="Delete"
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 