import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { FEEDBACK_RATINGS } from "../../utils/constants";
import Toast from "../../components/ui/Toast";

function FeedbackForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    rating: "",
    feedback: "",
  });

  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

      await api.post("/feedback", {
        rating: formData.rating,
        feedback: formData.feedback,
      });

      setToast({
        message: "Feedback submitted successfully!",
        type: "success",
      });

      setFormData({
        rating: "",
        feedback: "",
      });

      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setToast({
        message: "Failed to submit feedback",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      rating: "",
      feedback: "",
    });
  };

  const renderStars = () => {
    return (
      <div className="flex gap-2 mt-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() =>
              setFormData((prev) => ({ ...prev, rating: String(star) }))
            }
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg
                       transition-all duration-200 
                       ${
                         Number(formData.rating) >= star
                           ? "bg-amber-100 text-amber-500 scale-110 shadow-sm"
                           : "bg-gray-50 text-gray-300 hover:bg-gray-100 hover:text-gray-400"
                       }`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="mb-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-900">Submit Feedback</h1>
        <p className="text-gray-500 mt-1">
          Share your experience with the public transport service.
        </p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              How would you rate the service? <span className="text-red-500">*</span>
            </label>

            {renderStars()}

            {formData.rating && (
              <p className="text-xs text-gray-400 mt-2">
                You selected:{" "}
                <span className="font-semibold text-amber-600">
                  {FEEDBACK_RATINGS.find((r) => r.value === formData.rating)
                    ?.label || formData.rating}
                </span>
              </p>
            )}

            <select
              name="rating"
              className="hidden"
              value={formData.rating}
              onChange={handleChange}
              required
            >
              <option value="">Select rating</option>
              {FEEDBACK_RATINGS.map((rating) => (
                <option key={rating.value} value={rating.value}>
                  {rating.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Your Feedback <span className="text-red-500">*</span>
            </label>

            <textarea
              name="feedback"
              className="textarea-field"
              placeholder="Tell us about your experience — what went well, what could be improved..."
              value={formData.feedback}
              onChange={handleChange}
              required
              maxLength={500}
              rows={5}
            />

            <p className="text-xs text-gray-400 mt-1.5">
              {formData.feedback.length} / 500 characters
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="btn-primary flex-1 sm:flex-none"
              disabled={loading}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              {loading ? "Submitting..." : "Submit Feedback"}
            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={handleReset}
              disabled={loading}
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FeedbackForm;