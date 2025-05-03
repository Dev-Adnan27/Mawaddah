"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaArrowLeft, FaUpload, FaImage } from "react-icons/fa";

// Simple Rich Text Editor component
const RichTextEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value || '';
      
      const handleInput = () => {
        if (onChange) {
          onChange(editorRef.current.innerHTML);
        }
      };
      
      editorRef.current.addEventListener('input', handleInput);
      
      return () => {
        if (editorRef.current) {
          editorRef.current.removeEventListener('input', handleInput);
        }
      };
    }
  }, [value, onChange]);

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
      if (onChange) {
        onChange(editorRef.current.innerHTML);
      }
    }
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="bg-gray-100 p-2 border-b flex flex-wrap gap-2">
        <button 
          type="button" 
          onClick={() => execCommand('bold')}
          className="p-1 hover:bg-gray-200 rounded"
        >
          <strong>B</strong>
        </button>
        <button 
          type="button" 
          onClick={() => execCommand('italic')}
          className="p-1 hover:bg-gray-200 rounded"
        >
          <em>I</em>
        </button>
        <button 
          type="button" 
          onClick={() => execCommand('underline')}
          className="p-1 hover:bg-gray-200 rounded"
        >
          <u>U</u>
        </button>
        <button 
          type="button" 
          onClick={() => execCommand('insertOrderedList')}
          className="p-1 hover:bg-gray-200 rounded"
        >
          1.
        </button>
        <button 
          type="button" 
          onClick={() => execCommand('insertUnorderedList')}
          className="p-1 hover:bg-gray-200 rounded"
        >
          •
        </button>
        <button 
          type="button" 
          onClick={() => {
            const url = prompt('Enter the URL:');
            if (url) execCommand('createLink', url);
          }}
          className="p-1 hover:bg-gray-200 rounded"
        >
          Link
        </button>
        <button 
          type="button" 
          onClick={() => execCommand('formatBlock', '<h2>')}
          className="p-1 hover:bg-gray-200 rounded"
        >
          H2
        </button>
        <button 
          type="button" 
          onClick={() => execCommand('formatBlock', '<h3>')}
          className="p-1 hover:bg-gray-200 rounded"
        >
          H3
        </button>
        <button 
          type="button" 
          onClick={() => execCommand('formatBlock', '<p>')}
          className="p-1 hover:bg-gray-200 rounded"
        >
          P
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable="true"
        className="p-4 min-h-64 focus:outline-none"
        onBlur={() => {
          if (onChange) {
            onChange(editorRef.current.innerHTML);
          }
        }}
      />
    </div>
  );
};

export default function EditBlog({ params }) {
  const { slug } = params;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    summary: "",
    content: "",
    author: "",
    coverImage: "",
    tags: "",
    isPublished: true
  });
  
  const [previewImage, setPreviewImage] = useState(null);
  const [originalSlug, setOriginalSlug] = useState("");
  const fileInputRef = useRef(null);

  // Fetch blog data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/blogs/${slug}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch blog");
        }
        
        const { blog } = data;
        setOriginalSlug(blog.slug);
        
        setFormData({
          slug: blog.slug,
          title: blog.title,
          summary: blog.summary,
          content: blog.content,
          author: blog.author,
          coverImage: blog.coverImage,
          tags: blog.tags ? blog.tags.join(", ") : "",
          isPublished: blog.isPublished
        });
      } catch (error) {
        console.error("Error fetching blog:", error);
        toast.error(error.message || "Error loading blog");
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlog();
  }, [slug]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === "checkbox") {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleContentChange = (value) => {
    setFormData(prev => ({ ...prev, content: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only image files (JPG, PNG, GIF, WEBP) are allowed');
      return;
    }

    // Preview the image
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewImage(event.target.result);
    };
    reader.readAsDataURL(file);

    // Upload the image
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload image');
      }

      setFormData(prev => ({ ...prev, coverImage: data.imageUrl }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(error.message || 'Error uploading image');
    }
  };

  const handleInlineImageUpload = async () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only image files (JPG, PNG, GIF, WEBP) are allowed');
        return;
      }
      
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        toast.info('Uploading image...', { autoClose: false, toastId: 'uploading' });
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to upload image');
        }
        
        // Use execCommand to insert image
        document.execCommand('insertHTML', false, `<img src="${data.imageUrl}" style="max-width: 100%;" />`);
        
        // Update the content in formData
        const editorContent = document.querySelector('[contenteditable="true"]');
        if (editorContent) {
          setFormData(prev => ({ ...prev, content: editorContent.innerHTML }));
        }
        
        toast.dismiss('uploading');
        toast.success('Image inserted successfully');
      } catch (error) {
        toast.dismiss('uploading');
        console.error('Error uploading inline image:', error);
        toast.error(error.message || 'Error uploading image');
      }
    };
    
    input.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.slug || !formData.summary || !formData.content || !formData.author || !formData.coverImage) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);
        
      const blogData = {
        ...formData,
        tags: tagsArray
      };
      
      const response = await fetch(`/api/blogs/${originalSlug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blogData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update blog');
      }
      
      toast.success('Blog updated successfully!');
      setTimeout(() => {
        router.push('/admin/blogs');
      }, 1500);
    } catch (error) {
      console.error('Error updating blog:', error);
      toast.error(error.message || 'Error updating blog');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center mb-6">
          <Link href="/admin/blogs" className="text-blue-600 hover:text-blue-800 mr-4">
            <FaArrowLeft />
          </Link>
          <h1 className="text-2xl font-bold">Edit Blog</h1>
        </div>
        <div className="h-96 flex items-center justify-center">
          <div className="text-xl text-gray-500">Loading blog data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <ToastContainer />
      
      {/* Header */}
      <div className="flex items-center mb-6">
        <Link href="/admin/blogs" className="text-blue-600 hover:text-blue-800 mr-4">
          <FaArrowLeft />
        </Link>
        <h1 className="text-2xl font-bold">Edit Blog</h1>
      </div>
      
      {/* Blog Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div>
            {/* Title Field */}
            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter blog title"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            {/* Slug Field */}
            <div className="mb-4">
              <label htmlFor="slug" className="block text-gray-700 font-medium mb-2">
                Slug *
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="my-blog-post"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Used in the URL. Be careful when changing this.
              </p>
            </div>
            
            {/* Author Field */}
            <div className="mb-4">
              <label htmlFor="author" className="block text-gray-700 font-medium mb-2">
                Author *
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            {/* Tags Field */}
            <div className="mb-4">
              <label htmlFor="tags" className="block text-gray-700 font-medium mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="weddings, islam, family"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Published Switch */}
            <div className="mb-6">
              <div className="flex items-center">
                <label htmlFor="isPublished" className="mr-3 text-gray-700 font-medium">Published</label>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    id="isPublished"
                    name="isPublished"
                    checked={formData.isPublished}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="isPublished"
                    className={`block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer ${
                      formData.isPublished ? "bg-blue-500" : ""
                    }`}
                  >
                    <span
                      className={`h-6 w-6 block rounded-full bg-white shadow transform transition-transform duration-200 ease-in ${
                        formData.isPublished ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </label>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Toggle off to save as draft
              </p>
            </div>
          </div>
          
          {/* Right Column */}
          <div>
            {/* Cover Image Field */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Cover Image *
              </label>
              
              <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                {previewImage ? (
                  <div className="mb-3">
                    <img
                      src={previewImage}
                      alt="Cover preview"
                      className="max-h-40 max-w-full mx-auto object-contain"
                    />
                  </div>
                ) : formData.coverImage ? (
                  <div className="mb-3">
                    <img
                      src={formData.coverImage}
                      alt="Cover preview"
                      className="max-h-40 max-w-full mx-auto object-contain"
                    />
                  </div>
                ) : (
                  <div className="text-gray-500 mb-3 flex flex-col items-center justify-center py-4">
                    <FaImage size={40} className="mb-2" />
                    <p>No image selected</p>
                  </div>
                )}
                
                <input
                  type="file"
                  id="coverImage"
                  onChange={handleImageUpload}
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                />
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md inline-flex items-center"
                >
                  <FaUpload className="mr-2" />
                  {formData.coverImage ? "Change Image" : "Upload Image"}
                </button>
              </div>
              
              {formData.coverImage && (
                <p className="text-sm text-green-600 mt-2">
                  Image is set
                </p>
              )}
            </div>
            
            {/* Summary Field */}
            <div className="mb-4">
              <label htmlFor="summary" className="block text-gray-700 font-medium mb-2">
                Summary *
              </label>
              <textarea
                id="summary"
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                placeholder="Brief description of the blog post"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                required
              />
            </div>
          </div>
        </div>
        
        {/* Content Field - Full Width */}
        <div className="mt-6">
          <label className="block text-gray-700 font-medium mb-2">
            Content *
          </label>
          
          <div className="relative mb-2">
            <button
              type="button"
              onClick={handleInlineImageUpload}
              className="absolute right-2 top-2 z-10 bg-gray-200 hover:bg-gray-300 p-2 rounded-md"
              title="Insert Image"
            >
              <FaImage size={18} />
            </button>
          </div>
          
          <RichTextEditor
            value={formData.content}
            onChange={handleContentChange}
          />
        </div>
        
        {/* Submit Button */}
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`py-2 px-6 rounded-md text-white font-medium ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Saving..." : "Update Blog"}
          </button>
        </div>
      </form>
    </div>
  );
} 