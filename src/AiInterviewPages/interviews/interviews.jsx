import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Dropdown from "@/components/ui/Dropdown";
import Badge from "@/components/ui/Badge";
import Tippy from "@tippyjs/react";
import interviewsData from "@/constant/interviews-data";

const Interviews = () => {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Status options
  const statusOptions = ["All", "Sent", "Completed", "Pending", "In Progress", "Expired"];

  // Filter interviews
  const filteredInterviews = useMemo(() => {
    return interviewsData.filter(interview => {
      // Search by candidate name, job title, or email
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!interview.candidateName.toLowerCase().includes(query) &&
            !interview.jobTitle.toLowerCase().includes(query) &&
            !interview.candidateEmail.toLowerCase().includes(query)) {
          return false;
        }
      }

      // Filter by status
      if (statusFilter !== "All" && interview.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [searchQuery, statusFilter]);

  // Get status badge color and icon
  const getStatusConfig = (status) => {
    switch (status) {
      case "Sent":
        return {
          color: "bg-blue-100 text-blue-800 border-blue-200",
          icon: "heroicons-outline:paper-airplane",
          iconColor: "text-blue-600"
        };
      case "Completed":
        return {
          color: "bg-emerald-100 text-emerald-800 border-emerald-200",
          icon: "heroicons-outline:check-circle",
          iconColor: "text-emerald-600"
        };
      case "Pending":
        return {
          color: "bg-amber-100 text-amber-800 border-amber-200",
          icon: "heroicons-outline:clock",
          iconColor: "text-amber-600"
        };
      case "In Progress":
        return {
          color: "bg-purple-100 text-purple-800 border-purple-200",
          icon: "heroicons-outline:arrow-path",
          iconColor: "text-purple-600"
        };
      case "Expired":
        return {
          color: "bg-red-100 text-red-800 border-red-200",
          icon: "heroicons-outline:exclamation-circle",
          iconColor: "text-red-600"
        };
      default:
        return {
          color: "bg-slate-100 text-slate-800 border-slate-200",
          icon: "heroicons-outline:information-circle",
          iconColor: "text-slate-600"
        };
    }
  };

  // Handle row selection
  const toggleRowSelection = (id) => {
    setSelectedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  // Handle select all
  const toggleSelectAll = () => {
    if (selectedRows.length === filteredInterviews.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredInterviews.map(interview => interview.id));
    }
  };

  // Handle actions
  const handleAction = (action, interview) => {
    switch (action) {
      case "resend":
        alert(`Resending interview link to ${interview.candidateEmail}`);
        // Implement resend logic
        break;
      case "setDeadline":
        // Open deadline modal
        console.log("Set deadline for:", interview.id);
        break;
      case "viewProgress":
        navigate(`/interview-details/${interview.id}`);
        break;
      case "viewResults":
        navigate(`/interview-results/${interview.id}`);
        break;
      case "sendLink":
        // Open send link modal
        console.log("Send interview link");
        break;
      case "configureFlow":
        navigate("/interview-flow");
        break;
      default:
        break;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get days remaining
  const getDaysRemaining = (deadline) => {
    if (!deadline) return null;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { days: Math.abs(diffDays), status: "overdue" };
    if (diffDays === 0) return { days: 0, status: "today" };
    return { days: diffDays, status: "remaining" };
  };

  return (
    <div>
      {/* Header Section */}
      <div className="md:flex md:justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Interview Management</h1>
           <div className="flex gap-3 mt-4 md:mt-0">
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={() => handleAction("sendLink")}
          >
            <Icon icon="heroicons-outline:link" className="w-4 h-4 mr-2" />
            Send AI Interview Link
          </Button>
          <Button
            className="bg-slate-800 hover:bg-slate-900 text-white"
            onClick={() => handleAction("configureFlow")}
          >
            <Icon icon="heroicons-outline:cog-6-tooth" className="w-4 h-4 mr-2" />
            Configure Interview Flow
          </Button>
        </div>
        </div>
        {/* <div className="flex gap-3 mt-4 md:mt-0">
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={() => handleAction("sendLink")}
          >
            <Icon icon="heroicons-outline:link" className="w-4 h-4 mr-2" />
            Send AI Interview Link
          </Button>
          <Button
            className="bg-slate-800 hover:bg-slate-900 text-white"
            onClick={() => handleAction("configureFlow")}
          >
            <Icon icon="heroicons-outline:cog-6-tooth" className="w-4 h-4 mr-2" />
            Configure Interview Flow
          </Button>
        </div> */}
          <div className="relative">
              <Input
                type="text"
                placeholder="Search interviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
              <Icon
                icon="heroicons-outline:search"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5"
              />
            </div>
      </div>


      {/* Bulk Actions */}
      {selectedRows.length > 0 && (
        <div className="flex gap-3 mb-6">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => {
              alert(`Resending interview links to ${selectedRows.length} candidates`);
              setSelectedRows([]);
            }}
          >
            <Icon icon="heroicons-outline:paper-airplane" className="w-4 h-4 mr-2" />
            Re-send Selected ({selectedRows.length})
          </Button>
          <Button
            className="bg-slate-800 hover:bg-slate-900 text-white"
            onClick={() => {
              console.log("Set deadlines for selected:", selectedRows);
            }}
          >
            <Icon icon="heroicons-outline:calendar" className="w-4 h-4 mr-2" />
            Set Deadline for Selected
          </Button>
          <Button
            className="border border-red-300 hover:bg-red-50 text-red-600"
            onClick={() => setSelectedRows([])}
          >
            <Icon icon="heroicons-outline:x-mark" className="w-4 h-4 mr-2" />
            Clear Selection
          </Button>
        </div>
      )}

      {/* Interviews Table */}
      <Card noborder>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-12">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === filteredInterviews.length && filteredInterviews.length > 0}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 text-blue-600 border-slate-300 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Candidate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Job Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Deadline
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredInterviews.map((interview) => {
                const statusConfig = getStatusConfig(interview.status);
                const daysRemaining = getDaysRemaining(interview.deadline);
                
                return (
                  <tr key={interview.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(interview.id)}
                        onChange={() => toggleRowSelection(interview.id)}
                        className="h-4 w-4 text-blue-600 border-slate-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-slate-900">{interview.candidateName}</div>
                        <div className="text-sm text-slate-500">{interview.candidateEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{interview.jobTitle}</div>
                      <div className="text-sm text-slate-500">{interview.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={statusConfig.color}>
                        <Icon icon={statusConfig.icon} className={`w-3 h-3 mr-1 ${statusConfig.iconColor}`} />
                        {interview.status}
                      </Badge>
                      <div className="text-xs text-slate-500 mt-1">
                        {formatDate(interview.statusDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">
                        {formatDate(interview.deadline)}
                      </div>
                      {daysRemaining && (
                        <div className={`text-xs font-medium ${
                          daysRemaining.status === "overdue" ? "text-red-600" :
                          daysRemaining.status === "today" ? "text-amber-600" :
                          "text-emerald-600"
                        }`}>
                          {daysRemaining.status === "overdue" && `${daysRemaining.days} days overdue`}
                          {daysRemaining.status === "today" && "Due today"}
                          {daysRemaining.status === "remaining" && `${daysRemaining.days} days remaining`}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-32 bg-slate-200 rounded-full h-2 mr-3">
                          <div
                            className={`h-2 rounded-full ${
                              interview.progress === 100 ? 'bg-emerald-500' :
                              interview.progress >= 50 ? 'bg-blue-500' :
                              interview.progress > 0 ? 'bg-amber-500' :
                              'bg-slate-400'
                            }`}
                            style={{ width: `${interview.progress}%` }}
                          ></div>
                        </div>
                        <div className="text-sm font-medium text-slate-900">
                          {interview.progress}%
                        </div>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {interview.responses}/{interview.totalQuestions} questions
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Tippy content="Re-send Link">
                          <Button
                            className="text-blue-600 hover:text-blue-900 p-1"
                            onClick={() => handleAction("resend", interview)}
                          >
                            <Icon icon="heroicons-outline:paper-airplane" className="w-4 h-4" />
                          </Button>
                        </Tippy>
                        
                        <Tippy content="Set Deadline">
                          <Button
                            className="text-slate-600 hover:text-slate-900 p-1"
                            onClick={() => handleAction("setDeadline", interview)}
                          >
                            <Icon icon="heroicons-outline:calendar" className="w-4 h-4" />
                          </Button>
                        </Tippy>
                        
                        {interview.status === "Completed" ? (
                          <Tippy content="View Results">
                            <Button
                              className="text-emerald-600 hover:text-emerald-900 p-1"
                              onClick={() => handleAction("viewResults", interview)}
                            >
                              <Icon icon="heroicons-outline:chart-bar" className="w-4 h-4" />
                            </Button>
                          </Tippy>
                        ) : (
                          <Tippy content="interview" >
                            <Button
                              className="text-purple-600 hover:text-purple-900 p-1"
                                onClick={() => navigate(`/interview-flow`)}
                            >
                              <Icon icon="heroicons-outline:arrow-right-circle" className="w-4 h-4" />
                            </Button>
                          </Tippy>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* No results */}
          {filteredInterviews.length === 0 && (
            <div className="text-center py-12">
              <Icon icon="heroicons-outline:video-camera" className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No interviews found</h3>
              <p className="text-slate-600">Try adjusting your filters or send new interview invitations.</p>
              <Button
                className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white"
                onClick={() => handleAction("sendLink")}
              >
                <Icon icon="heroicons-outline:plus" className="w-4 h-4 mr-2" />
                Send New Interview Link
              </Button>
            </div>
          )}
        </div>

        {/* Results count */}
        {filteredInterviews.length > 0 && (
          <div className="flex justify-between items-center mt-6 pt-6 border-t border-slate-200">
            <div className="text-sm text-slate-600">
              Showing {filteredInterviews.length} of {interviewsData.length} interviews
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

export default Interviews;