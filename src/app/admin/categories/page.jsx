"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ChevronLeft, 
  PlusCircle, 
  Edit, 
  Trash2, 
  ArrowDown, 
  ArrowUp,
  Loader2 
} from "lucide-react";
import { toast } from "react-hot-toast";
import CategoryModal from '@/components/CategoryModal';

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCategory, setNewCategory] = useState("");
  const [editCategory, setEditCategory] = useState({ id: null, name: "" });
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  
  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);
  
  // Fetch all categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/faqs/categories");
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch categories");
      }
      
      const data = await response.json();
      setCategories(data.categories);
      setError(null);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError(err.message);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };
  
  // Add a new category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    
    if (!newCategory.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }
    
    try {
      setIsAdding(true);
      const response = await fetch("/api/faqs/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to add category");
      }
      
      setCategories([...categories, data.category]);
      setNewCategory("");
      toast.success("Category added successfully");
    } catch (err) {
      console.error("Error adding category:", err);
      toast.error(err.message);
    } finally {
      setIsAdding(false);
    }
  };
  
  // Start editing a category
  const startEdit = (category) => {
    setEditCategory({ id: category._id, name: category.name });
    setIsEditModalOpen(true);
  };
  
  // Cancel editing
  const cancelEdit = () => {
    setEditCategory({ id: null, name: "" });
    setIsEditing(false);
  };
  
  // Update a category
  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    
    if (!editCategory.name.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }
    
    try {
      const response = await fetch(`/api/faqs/categories/${editCategory.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editCategory.name }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to update category");
      }
      
      setCategories(
        categories.map((cat) => 
          cat._id === editCategory.id ? data.category : cat
        )
      );
      
      cancelEdit();
      toast.success("Category updated successfully");
    } catch (err) {
      console.error("Error updating category:", err);
      toast.error(err.message);
    }
  };
  
  // Delete a category
  const handleDeleteCategory = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) {
      return;
    }
    
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/faqs/categories/${id}`, {
        method: "DELETE",
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (data.count) {
          throw new Error(`Cannot delete: This category is used by ${data.count} FAQs`);
        }
        throw new Error(data.error || "Failed to delete category");
      }
      
      setCategories(categories.filter((cat) => cat._id !== id));
      toast.success("Category deleted successfully");
    } catch (err) {
      console.error("Error deleting category:", err);
      toast.error(err.message);
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link 
            href="/admin/dashboard" 
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold">Manage FAQ Categories</h1>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      {/* Add New Category Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Add New Category
        </button>
      </div>
      
      {/* Categories list */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Categories</h2>
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 size={30} className="animate-spin text-primary" />
            </div>
          ) : categories.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No categories found</p>
          ) : (
            <div className="space-y-4">
              {categories.map((category) => (
                <div 
                  key={category._id} 
                  className="p-4 border border-gray-200 rounded-lg flex items-center justify-between"
                >
                  {editCategory.id === category._id ? (
                    <form 
                      onSubmit={handleUpdateCategory} 
                      className="flex-1 flex items-center gap-2"
                    >
                      <input
                        type="text"
                        value={editCategory.name}
                        onChange={(e) => 
                          setEditCategory({ ...editCategory, name: e.target.value })
                        }
                        className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                        autoFocus
                      />
                      <button 
                        type="submit" 
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button 
                        type="button" 
                        onClick={cancelEdit} 
                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </form>
                  ) : (
                    <>
                      <span className="text-lg">{category.name}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startEdit(category)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          disabled={isEditing || isDeleting}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                          disabled={isEditing || isDeleting}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Category Modals */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={async (name) => {
          setModalLoading(true);
          try {
            const response = await fetch("/api/faqs/categories", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to add category");
            setCategories([...categories, data.category]);
            toast.success("Category added successfully");
            setIsModalOpen(false);
          } catch (err) {
            console.error(err);
            toast.error(err.message);
          } finally {
            setModalLoading(false);
          }
        }}
        loading={modalLoading}
      />
      <CategoryModal
        isOpen={isEditModalOpen}
        initialName={editCategory.name}
        isEditing
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={async (name) => {
          setModalLoading(true);
          try {
            const response = await fetch(`/api/faqs/categories/${editCategory.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to update category");
            setCategories(categories.map((cat) =>
              cat._id === editCategory.id ? data.category : cat
            ));
            toast.success("Category updated successfully");
            setIsEditModalOpen(false);
          } catch (err) {
            console.error(err);
            toast.error(err.message);
          } finally {
            setModalLoading(false);
          }
        }}
        loading={modalLoading}
      />
    </div>
  );
} 