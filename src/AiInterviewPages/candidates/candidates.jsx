import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import candidatesData from "@/constant/candidates-data";

const Candidates = () => {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    jobRole: "",
    aiScoreMin: "",
    aiScoreMax: "",
    interviewStatus: "",
  });

  // Job roles from existing data
  const jobRoles = useMemo(() => {
    const dynamicRoles = candidatesData.map(candidate => candidate.appliedJob);
    const allRoles = [...new Set([...dynamicRoles])].sort();
    return allRoles;
  }, [candidatesData]);
  // Interview status options
  const statusOptions = ["All", "Completed", "Scheduled", "In Progress", "Pending", "Rejected"];

  // Filter candidates
  const filteredCandidates = useMemo(() => {
    return candidatesData.filter(candidate => {
      // Search by name or keyword
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!candidate.candidateName.toLowerCase().includes(query) &&
          !candidate.appliedJob.toLowerCase().includes(query) &&
          !candidate.skills.some(skill => skill.toLowerCase().includes(query))) {
          return false;
        }
      }

      // Filter by job role
      if (filters.jobRole && candidate.appliedJob !== filters.jobRole) {
        return false;
      }

      // Filter by AI score range
      if (filters.aiScoreMin && candidate.aiScore < parseInt(filters.aiScoreMin)) {
        return false;
      }
      if (filters.aiScoreMax && candidate.aiScore > parseInt(filters.aiScoreMax)) {
        return false;
      }

      // Filter by interview status
      if (filters.interviewStatus && filters.interviewStatus !== "All" &&
        candidate.interviewStatus !== filters.interviewStatus) {
        return false;
      }

      return true;
    });
  }, [searchQuery, filters]);

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      jobRole: "",
      aiScoreMin: "",
      aiScoreMax: "",
      interviewStatus: "",
    });
    setSearchQuery("");
  };

  // Handle row selection
  const toggleRowSelection = (id) => {
    setSelectedRows(prev =>
      prev.includes(id)
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  // Get recommendation badge color
  const getRecommendationColor = (recommendation) => {
    switch (recommendation) {
      case "Strong Hire":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Review":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Reject":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "In Progress":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <div>
      {/* Header Section */}
      <div className="md:flex md:justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Candidate Management</h1>
          <p className="text-slate-600">
            View and manage all active candidates, filter by various criteria, and take quick actions.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button
            className="btn-md bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={() => navigate("/add-candidates")}
          >
            <Icon icon="heroicons-outline:user-add" className="w-4 h-4 mr-2" />
            Add Candidate
          </Button>
        </div>
      </div>

      {/* Filter Section */}
      <Card className="mb-6 rounded-xl">
        <h4 className="text-lg font-semibold text-slate-900 mb-4">Filter Candidates</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Job Role
            </label>
            <select
              value={filters.jobRole}
              onChange={(e) => setFilters({ ...filters, jobRole: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a job role</option>
              {jobRoles.map((role, index) => (
                <option key={index} value={role}>{role}</option>
              ))}
            </select>
          </div>

          {/* AI Score Range Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              AI Score Range: 0 - 100
            </label>
            <div className="flex gap-2">
              <Input
                type="number"
                min="0"
                max="100"
                placeholder="Min"
                value={filters.aiScoreMin}
                onChange={(e) => setFilters({ ...filters, aiScoreMin: e.target.value })}
                className="w-full"
              />
              <Input
                type="number"
                min="0"
                max="100"
                placeholder="Max"
                value={filters.aiScoreMax}
                onChange={(e) => setFilters({ ...filters, aiScoreMax: e.target.value })}
                className="w-full"
              />
            </div>
          </div>

          {/* Interview Status Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Interview Status
            </label>
            <Select
              value={filters.interviewStatus}
              onChange={(e) => setFilters({ ...filters, interviewStatus: e.target.value })}
              className="w-full"
            >
              <option value="">Select status</option>
              {statusOptions.map((status, index) => (
                <option key={index} value={status}>{status}</option>
              ))}
            </Select>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Search Candidate
            </label>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Search by name or key"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => { }}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Filter Actions */}
        <div className="flex justify-end mt-4 pt-4 border-t border-slate-100">
          <Button
            className="border border-slate-300 hover:bg-slate-50 text-slate-700"
            onClick={handleResetFilters}
          >
            Reset Filters
          </Button>
        </div>
      </Card>
      <h1 className="font-semibold text-[24px] leading-[32px] mb-6">
        Candidate List
      </h1>
      {/* Candidate List Table */}
      <Card className="rounded-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Candidate Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Applied Job
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  CV Match % (AI)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Interview Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  AI Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Recommendation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredCandidates.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(candidate.id)}
                        onChange={() => toggleRowSelection(candidate.id)}
                        className="h-4 w-4 text-blue-600 border-slate-300 rounded mr-3"
                      />
                      <div>
                        <div className="font-medium text-slate-900">{candidate.candidateName}</div>
                        <div className="text-sm text-slate-500">{candidate.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">{candidate.appliedJob}</div>
                    <div className="text-sm text-slate-500">{candidate.experience}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-slate-200 rounded-full h-2 mr-3">
                        <div
                          className={`h-2 rounded-full ${candidate.cvMatchPercent >= 80
                            ? 'bg-emerald-500'
                            : candidate.cvMatchPercent >= 60
                              ? 'bg-amber-500'
                              : 'bg-red-500'}`}
                          style={{ width: `${candidate.cvMatchPercent}%` }}
                        ></div>
                      </div>
                      <span className={`font-medium ${candidate.cvMatchPercent >= 80
                        ? 'text-emerald-700'
                        : candidate.cvMatchPercent >= 60
                          ? 'text-amber-700'
                          : 'text-red-700'}`}>
                        {candidate.cvMatchPercent}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={getStatusColor(candidate.interviewStatus)}>
                      {candidate.interviewStatus}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-lg font-bold text-slate-900">{candidate.aiScore}</div>
                    <div className="text-xs text-slate-500">/100</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={getRecommendationColor(candidate.recommendation)}>
                      {candidate.recommendation}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button
                      className="text-blue-600 hover:text-blue-900"
                      onClick={() => navigate(`/candidate-details/${candidate.id}`)}
                    >
                      View Detail
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* No results */}
          {filteredCandidates.length === 0 && (
            <div className="text-center py-12">
              <Icon icon="heroicons-outline:user-group" className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No candidates found</h3>
              <p className="text-slate-600">Try adjusting your filters or search criteria.</p>
            </div>
          )}
        </div>

        {/* Results count */}
        {filteredCandidates.length > 0 && (
          <div className="flex justify-between items-center mt-6 pt-6 border-t border-slate-200">
            <div className="text-sm text-slate-600">
              Showing {filteredCandidates.length} of {candidatesData.length} candidates
            </div>
            <div className="text-sm text-slate-600">
              {selectedRows.length} selected
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Candidates;