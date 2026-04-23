import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { COMPLAINT_STATUS } from "../../utils/constants";
import StatsCard from "../../components/ui/StatsCard";
import StatusBadge from "../../components/ui/StatusBadge";
import EmptyState from "../../components/ui/EmptyState";
import Toast from "../../components/ui/Toast";

function AdminPanel() {
  const [complaints, setComplaints] = useState([]);
  const [toast, setToast] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
    activeOfficers: 3,
  });

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      const response = await api.get("/complaints");
      const fetchedComplaints = response.data.complaints || [];

      const pending = fetchedComplaints.filter(
        (item) =>
          item.status === COMPLAINT_STATUS.SUBMITTED ||
          item.status === COMPLAINT_STATUS.IN_PROGRESS
      ).length;

      const resolved = fetchedComplaints.filter(
        (item) => item.status === COMPLAINT_STATUS.RESOLVED
      ).length;

      setComplaints(fetchedComplaints);
      setStats({
        total: fetchedComplaints.length,
        pending,
        resolved,
        activeOfficers: 3,
      });
    } catch (error) {
      console.error("Error loading complaints:", error);
      setToast({
        message: "Failed to load complaints",
        type: "error",
      });
    }
  };

  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      await api.put("/complaints", {
        complaintId,
        status: newStatus,
      });

      await loadComplaints();

      setToast({
        message: `Status updated to "${newStatus}" successfully`,
        type: "success",
      });
    } catch (error) {
      console.error("Error updating status:", error);
      setToast({
        message: "Failed to update complaint status",
        type: "error",
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-gray-500 mt-1">
          Manage complaints, assign officers, and monitor complaint resolution
          activity.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Total Complaints"
          value={stats.total}
          icon="📋"
          color="blue"
        />
        <StatsCard
          title="Pending"
          value={stats.pending}
          icon="⏳"
          color="yellow"
        />
        <StatsCard
          title="Resolved"
          value={stats.resolved}
          icon="✅"
          color="green"
        />
        <StatsCard
          title="Active Officers"
          value={stats.activeOfficers}
          icon="👮"
          color="indigo"
        />
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700">
            All Complaints
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage and update complaint statuses
          </p>
        </div>

        {complaints.length === 0 ? (
          <EmptyState
            title="No complaints available"
            subtitle="There are no complaints in the system yet."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Route
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Location
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Update Status
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Officer
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {complaints.map((complaint) => (
                  <tr
                    key={complaint.complaintId}
                    className={`hover:bg-blue-50/30 transition-colors duration-150 ${
                      complaint.status === COMPLAINT_STATUS.RESOLVED
                        ? "bg-emerald-50/20"
                        : ""
                    }`}
                  >
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {complaint.complaintId}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-800">
                        {complaint.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className="text-sm text-gray-600">
                        {complaint.routeNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="text-sm text-gray-500">
                        {complaint.location || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={complaint.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <select
                          className="select-field text-xs py-2 pr-8 min-w-[130px]"
                          value={complaint.status}
                          onChange={(e) =>
                            handleStatusChange(
                              complaint.complaintId,
                              e.target.value
                            )
                          }
                        >
                          <option value={COMPLAINT_STATUS.SUBMITTED}>
                            {COMPLAINT_STATUS.SUBMITTED}
                          </option>
                          <option value={COMPLAINT_STATUS.IN_PROGRESS}>
                            {COMPLAINT_STATUS.IN_PROGRESS}
                          </option>
                          <option value={COMPLAINT_STATUS.RESOLVED}>
                            {COMPLAINT_STATUS.RESOLVED}
                          </option>
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                          <span className="text-[10px] font-bold text-white">
                            R
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">
                          Officer Rahul
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;