import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api/axios";
import { COMPLAINT_STATUS } from "../../utils/constants";
import StatsCard from "../../components/ui/StatsCard";

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [stats, setStats] = useState({
    totalComplaints: 0,
    submittedComplaints: 0,
    resolvedComplaints: 0,
    inProgressComplaints: 0,
  });

  const [loading, setLoading] = useState(true);

  const loadDashboardStats = useCallback(async () => {
    try {
      setLoading(true);

      const response = await api.get("/complaints");
      const complaints = response.data.complaints || [];

      const submittedComplaints = complaints.filter(
        (item) => item.status === COMPLAINT_STATUS.SUBMITTED
      ).length;

      const resolvedComplaints = complaints.filter(
        (item) => item.status === COMPLAINT_STATUS.RESOLVED
      ).length;

      const inProgressComplaints = complaints.filter(
        (item) => item.status === COMPLAINT_STATUS.IN_PROGRESS
      ).length;

      setStats({
        totalComplaints: complaints.length,
        submittedComplaints,
        resolvedComplaints,
        inProgressComplaints,
      });
    } catch (error) {
      console.error("Error loading dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardStats();
  }, [loadDashboardStats]);

  useEffect(() => {
    loadDashboardStats();
  }, [location.pathname, loadDashboardStats]);

  useEffect(() => {
    const handleFocus = () => {
      loadDashboardStats();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [loadDashboardStats]);

  const resolutionRate =
    stats.totalComplaints > 0
      ? Math.round((stats.resolvedComplaints / stats.totalComplaints) * 100)
      : 0;

  const progressRate =
    stats.totalComplaints > 0
      ? Math.round((stats.inProgressComplaints / stats.totalComplaints) * 100)
      : 0;

  const pendingRate =
    stats.totalComplaints > 0
      ? Math.round(
          (stats.submittedComplaints / stats.totalComplaints) * 100
        )
      : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="animate-fade-in flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Passenger Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Welcome back! Track overall complaint activity at a glance.
          </p>
        </div>

        <button onClick={loadDashboardStats} className="btn-primary text-sm">
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Total Complaints"
          value={loading ? "..." : stats.totalComplaints}
          icon="📋"
          color="blue"
          subtitle="All complaints"
        />
        <StatsCard
          title="Submitted"
          value={loading ? "..." : stats.submittedComplaints}
          icon="📝"
          color="yellow"
          subtitle="Awaiting review"
        />
        <StatsCard
          title="In Progress"
          value={loading ? "..." : stats.inProgressComplaints}
          icon="⏳"
          color="indigo"
          subtitle="Under process"
        />
        <StatsCard
          title="Resolved"
          value={loading ? "..." : stats.resolvedComplaints}
          icon="✅"
          color="green"
          subtitle="Successfully closed"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            Resolution Progress
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500">Resolved</span>
                <span className="text-xs font-bold text-emerald-600">
                  {loading ? "..." : `${resolutionRate}%`}
                </span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: loading ? "0%" : `${resolutionRate}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500">In Progress</span>
                <span className="text-xs font-bold text-blue-600">
                  {loading ? "..." : `${progressRate}%`}
                </span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: loading ? "0%" : `${progressRate}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500">Pending</span>
                <span className="text-xs font-bold text-amber-600">
                  {loading ? "..." : `${pendingRate}%`}
                </span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: loading ? "0%" : `${pendingRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate("/complaint/new")}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">
                📝
              </span>
              <span className="text-xs font-semibold text-blue-700">
                New Complaint
              </span>
            </button>

            <button
              onClick={() => navigate("/complaints")}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 transition-colors group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">
                📋
              </span>
              <span className="text-xs font-semibold text-emerald-700">
                View Complaints
              </span>
            </button>

            <button
              onClick={() => navigate("/feedback")}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">
                💬
              </span>
              <span className="text-xs font-semibold text-purple-700">
                Give Feedback
              </span>
            </button>

            <button
              onClick={() => navigate("/admin")}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-amber-50 hover:bg-amber-100 transition-colors group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">
                ⚙️
              </span>
              <span className="text-xs font-semibold text-amber-700">
                Admin Panel
              </span>
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          How It Works
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              emoji: "📝",
              title: "Submit Complaint",
              desc: "Report route delays, staff issues, cleanliness problems, and transport-related grievances.",
            },
            {
              emoji: "🔍",
              title: "Track Complaint",
              desc: "Check whether your complaint is submitted, in progress, or resolved by the officer.",
            },
            {
              emoji: "💬",
              title: "Give Feedback",
              desc: "Rate transport services and help authorities improve quality and passenger experience.",
            },
            {
              emoji: "👨‍💼",
              title: "Admin Monitoring",
              desc: "Authorities can assign complaints, update statuses, and review performance trends.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="card-hover group cursor-default"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform inline-block">
                {feature.emoji}
              </span>
              <h4 className="font-semibold text-gray-800 mb-2">
                {feature.title}
              </h4>
              <p className="text-sm text-gray-500 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;