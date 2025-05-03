import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function CategoryModal({ isOpen, onClose, onSubmit, initialName = "", isEditing = false, loading = false }) {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
        <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Category' : 'Add New Category'}</h2>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(name); }}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category name"
            required
            className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Saving...' : (isEditing ? 'Update Category' : 'Add Category')}
          </button>
        </form>
      </div>
    </div>
  );
} 