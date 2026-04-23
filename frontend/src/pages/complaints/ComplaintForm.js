import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { COMPLAINT_CATEGORIES } from "../../utils/constants";
import Toast from "../../components/ui/Toast";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

function ComplaintForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    category: "",
    routeNumber: "",
    location: "",
    description: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [fileName, setFileName] = useState("");

  const handleChange = (event) => {
    const { name, value, files } = event.target;

    if (name === "image") {
      setFormData((prev) => ({
        ...prev,
        image: files[0] ? files[0].name : "",
      }));
      setFileName(files[0] ? files[0].name : "");
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

      await api.post("/complaints", {
        category: formData.category,
        routeNumber: formData.routeNumber,
        location: formData.location,
        description: formData.description,
        image: formData.image,
      });

      setToast({ message: "Complaint submitted successfully!", type: "success" });

      setFormData({
        category: "",
        routeNumber: "",
        location: "",
        description: "",
        image: "",
      });
      setFileName("");

      setTimeout(() => navigate("/complaints"), 2000);
    } catch (error) {
      console.error("Error submitting complaint:", error);
      setToast({ message: "Failed to submit complaint. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      category: "",
      routeNumber: "",
      location: "",
      description: "",
      image: "",
    });
    setFileName("");
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Toast notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Page Header */}
      <div className="mb-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-900">Submit Complaint</h1>
        <p className="text-gray-500 mt-1">
          Fill in the details below to register your grievance about public
          transport services.
        </p>
      </div>

      {/* Form Card */}
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Complaint Category <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="category"
                className="select-field"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {COMPLAINT_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Route and Location - two columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Route / Bus Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="routeNumber"
                className="input-field"
                placeholder="e.g. Route 42, Bus MH-12"
                value={formData.routeNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                className="input-field"
                placeholder="e.g. Central Station"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              className="textarea-field"
              placeholder="Describe the issue in detail..."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Upload Evidence (Optional)
            </label>
            <label
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed 
                         border-gray-200 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 
                         hover:border-blue-300 transition-all duration-200"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {fileName ? (
                  <>
                    <svg className="w-8 h-8 text-blue-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-gray-700 font-medium">{fileName}</p>
                    <p className="text-xs text-gray-400 mt-1">Click to change</p>
                  </>
                ) : (
                  <>
                    <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
                  </>
                )}
              </div>
              <input
                type="file"
                name="image"
                className="hidden"
                onChange={handleChange}
                accept="image/*"
              />
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="btn-primary flex-1 sm:flex-none"
              disabled={loading}
            >
              {loading ? (
                <LoadingSpinner text="Submitting..." />
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Submit Complaint
                </>
              )}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleClear}
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ComplaintForm;