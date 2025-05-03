"use client";
import { useState, useEffect } from "react";
import { FaEnvelope, FaCheck, FaTimes, FaTrash, FaEye } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ContactsAdmin() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/contacts");
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch contacts");
      }
      
      setContacts(data.contacts || []);
    } catch (error) {
      toast.error(error.message || "Error loading contacts");
      console.error("Error loading contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`/api/contacts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to update status");
      }
      
      // Update contact in local state
      setContacts(contacts.map(contact => 
        contact._id === id ? { ...contact, status: newStatus } : contact
      ));
      
      if (currentContact && currentContact._id === id) {
        setCurrentContact({ ...currentContact, status: newStatus });
      }
      
      toast.success("Status updated successfully");
    } catch (error) {
      toast.error(error.message || "Error updating status");
      console.error("Error updating status:", error);
    }
  };

  const viewContactDetails = (contact) => {
    setCurrentContact(contact);
    setShowModal(true);
  };

  const confirmDeleteContact = (id) => {
    setConfirmDelete(id);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/contacts/${id}`, {
        method: "DELETE"
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to delete contact");
      }
      
      fetchContacts();
      toast.success("Contact deleted successfully");
      
      if (showModal && currentContact && currentContact._id === id) {
        setShowModal(false);
      }
    } catch (error) {
      toast.error(error.message || "Error deleting contact");
      console.error("Error deleting contact:", error);
    } finally {
      setConfirmDelete(null);
    }
  };

  const filteredContacts = statusFilter === "all" 
    ? contacts 
    : contacts.filter(contact => contact.status === statusFilter);

  return (
    <div className="p-6">
      <ToastContainer />
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Contact Form Submissions</h1>
        
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filter by status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-1 px-3 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Contacts</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="responded">Responded</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>
      
      {/* Contacts List */}
      {loading ? (
        <div className="text-center py-10">Loading contacts...</div>
      ) : contacts.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No contact submissions found.</p>
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No contact submissions match the selected filter.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message Preview
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContacts.map((contact) => (
                <tr key={contact._id} className={contact.status === "new" ? "bg-blue-50" : ""}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                    <div className="text-sm text-gray-500">{contact.email}</div>
                    {contact.phone && (
                      <div className="text-sm text-gray-500">{contact.phone}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 truncate max-w-xs">
                      {contact.message.substring(0, 100)}
                      {contact.message.length > 100 ? "..." : ""}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        contact.status === "new"
                          ? "bg-blue-100 text-blue-800"
                          : contact.status === "read"
                          ? "bg-yellow-100 text-yellow-800"
                          : contact.status === "responded"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(contact.createdAt).toLocaleDateString()} <br />
                    {new Date(contact.createdAt).toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {confirmDelete === contact._id ? (
                      <div className="flex justify-end items-center gap-2">
                        <span className="text-sm text-red-600 mr-2">Delete?</span>
                        <button
                          onClick={() => handleDelete(contact._id)}
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
                        <button
                          onClick={() => viewContactDetails(contact)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <FaEye size={18} />
                        </button>
                        <button
                          onClick={() => confirmDeleteContact(contact._id)}
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
      
      {/* Contact Details Modal */}
      {showModal && currentContact && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h3 className="text-xl font-semibold">Contact Details</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 uppercase mb-2">Contact Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{currentContact.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{currentContact.email}</p>
                  </div>
                  {currentContact.phone && (
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{currentContact.phone}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">
                      {new Date(currentContact.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 uppercase mb-2">Message</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="whitespace-pre-wrap">{currentContact.message}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 uppercase mb-2">Status</h4>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleStatusChange(currentContact._id, "new")}
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      currentContact.status === "new"
                        ? "bg-blue-600 text-white"
                        : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                    }`}
                  >
                    New
                  </button>
                  <button
                    onClick={() => handleStatusChange(currentContact._id, "read")}
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      currentContact.status === "read"
                        ? "bg-yellow-600 text-white"
                        : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                    }`}
                  >
                    Read
                  </button>
                  <button
                    onClick={() => handleStatusChange(currentContact._id, "responded")}
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      currentContact.status === "responded"
                        ? "bg-green-600 text-white"
                        : "bg-green-100 text-green-800 hover:bg-green-200"
                    }`}
                  >
                    Responded
                  </button>
                  <button
                    onClick={() => handleStatusChange(currentContact._id, "archived")}
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      currentContact.status === "archived"
                        ? "bg-gray-600 text-white"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    Archived
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between border-t pt-4">
                <button
                  onClick={() => confirmDeleteContact(currentContact._id)}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md flex items-center"
                >
                  <FaTrash className="mr-2" size={14} /> Delete
                </button>
                <a
                  href={`mailto:${currentContact.email}?subject=RE: Your Contact Form Submission`}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md flex items-center"
                >
                  <FaEnvelope className="mr-2" size={14} /> Reply via Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 