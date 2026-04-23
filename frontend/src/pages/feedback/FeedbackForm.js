import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FEEDBACK_RATINGS } from "../../utils/constants";
import Toast from "../../components/ui/Toast";

function FeedbackForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    rating: "",
    feedback: "",
  });

  const [toast, setToast] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const newFeedback = {
      id: `FDB${Date.now()}`,
      rating: formData.rating,
      feedback: formData.feedback,
      submittedAt: new Date().toLocaleString(),
    };

    const existingFeedback =
      JSON.parse(localStorage.getItem("feedbacks")) || [];

    existingFeedback.push(newFeedback);

    localStorage.setItem("feedbacks", JSON.stringify(existingFeedback));

    setToast({ message: "Feedback submitted successfully!", type: "success" });
    console.log("Saved Feedback:", newFeedback);

    setFormData({
      rating: "",
      feedback: "",
    });

    setTimeout(() => navigate("/dashboard"), 2000);
  };

  const handleReset = () => {
    setFormData({
      rating: "",
      feedback: "",
    });
  };

  // Star rating display
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
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Page Header */}
      <div className="mb-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-900">Submit Feedback</h1>
        <p className="text-gray-500 mt-1">
          Share your experience with the public transport service.
        </p>
      </div>

      {/* Form Card */}
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
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
            {/* Hidden select for form validation */}
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

          {/* Feedback Text */}
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
              rows={5}
            />
            <p className="text-xs text-gray-400 mt-1.5">
              {formData.feedback.length} / 500 characters
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1 sm:flex-none">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Submit Feedback
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleReset}
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