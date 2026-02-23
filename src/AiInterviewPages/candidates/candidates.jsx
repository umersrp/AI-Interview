import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import {
  useTable,
  useRowSelect,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "@/assets/images/logo/logo3.png";
import Tippy from "@tippyjs/react";

const Candidates = () => {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [jobOptions, setJobOptions] = useState([]);

  // Pagination states
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pages, setPages] = useState(1);
  const [processingCandidateId, setProcessingCandidateId] = useState(null);
  const [processingBatch, setProcessingBatch] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState("");

  // Process single candidate for AI scoring
  const processSingleCandidate = useCallback(async (candidateId) => {
    try {
      setProcessingCandidateId(candidateId);
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("candidateId", candidateId);

      const response = await axios.post(
        `http://13.51.230.148:8003/api/v1/scoring/process-candidate`,
        formData,
        { headers: { Authorization: `${token}` } }
      );

      toast.success("Candidate AI score processed successfully");
      fetchCandidates(); // Refresh to get updated scores
      return response.data;
    } catch (error) {
      console.error("Error processing single candidate:", error);
      toast.error(error.response?.data?.message || "Failed to process candidate");
    } finally {
      setProcessingCandidateId(null);
    }
  }, []);

  // Batch process candidates for AI scoring
  const batchProcessCandidates = useCallback(async (jobId) => {
    try {
      if (!jobId) {
        toast.error("Please select a job first");
        return;
      }

      setProcessingBatch(true);
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("jobId", jobId);

      const response = await axios.post(
        `http://13.51.230.148:8003/api/v1/scoring/batch-process-candidates`,
        formData,
        { headers: { Authorization: `${token}` } }
      );

      toast.success("Batch processing started for all candidates");
      fetchCandidates(); // Refresh to get updated scores
      return response.data;
    } catch (error) {
      console.error("Error in batch processing:", error);
      toast.error(error.response?.data?.message || "Failed to start batch processing");
    } finally {
      setProcessingBatch(false);
    }
  }, []);

  // Ultra-safe string converter
  const safeString = (value, defaultValue = '') => {
    try {
      if (value === null || value === undefined) return defaultValue;
      if (typeof value === 'string') return value;
      if (typeof value === 'number') return String(value);
      if (typeof value === 'boolean') return String(value);
      if (typeof value === 'object') {
        // Try common properties
        if (value.value && typeof value.value === 'string') return value.value;
        if (value.name && typeof value.name === 'string') return value.name;
        if (value.label && typeof value.label === 'string') return value.label;
        if (value._id) return value._id;
        // If all else fails, try to stringify
        try {
          return JSON.stringify(value);
        } catch {
          return defaultValue;
        }
      }
      return defaultValue;
    } catch (error) {
      console.error('Error in safeString:', error, value);
      return defaultValue;
    }
  };

  // Safe lowercase with error handling
  const safeLowerCase = (value, defaultValue = '') => {
    try {
      const str = safeString(value, defaultValue);
      return str.toLowerCase();
    } catch (error) {
      console.error('Error in safeLowerCase:', error, value);
      return defaultValue.toLowerCase();
    }
  };

  // Fetch jobs for dropdown
  const fetchJobs = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/jobs/GetAll?page=1&limit=100`,
        { headers: { Authorization: `${token}` } }
      );

      const jobsData = response.data?.data?.jobs || response.data?.data || [];
      setJobOptions(jobsData);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  }, []);

  // Fetch candidates from API
  const fetchCandidates = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/candidates?page=${page}&limit=${limit}`,
        { headers: { Authorization: `${token}` } }
      );

      console.log("Candidates API Response:", response.data);

      // Handle different response structures
      const candidatesData = response.data?.data?.candidates || response.data?.data || [];

      // Log the first candidate to see the structure
      if (candidatesData.length > 0) {
        console.log("First candidate structure:", candidatesData[0]);
        console.log("InterviewStatus type:", typeof candidatesData[0]?.interviewStatus);
        console.log("InterviewStatus value:", candidatesData[0]?.interviewStatus);
        console.log("Recommendation type:", typeof candidatesData[0]?.recommendation);
        console.log("Recommendation value:", candidatesData[0]?.recommendation);
      }

      setCandidates(candidatesData);

      // Update pagination if available
      if (response.data?.pagination) {
        setTotal(response.data.pagination.total || 0);
        setPages(response.data.pagination.pages || 1);
      } else if (response.data?.data?.total) {
        setTotal(response.data.data.total);
        setPages(response.data.data.pages || 1);
      }

      setError(null);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      setError("Failed to load candidates");
      toast.error(error.response?.data?.message || "Failed to load candidates");
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchCandidates();
    fetchJobs();
  }, [fetchCandidates, fetchJobs]);

  // Handle candidate actions
  const handleAction = async (action, row) => {
    const candidateId = row.original._id || row.original.id;

    if (action === "edit") {
      navigate(`/add-candidates/${candidateId}`);
    }
    if (action === "view") {
      navigate(`/add-candidates/${candidateId}`);
    }
    if (action === "delete") {
      setSelectedCandidateId(candidateId);
      setDeleteModalOpen(true);
    }
  };

  const handleDeleteCandidate = async (candidateId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_APP_BASE_URL}/candidates/${candidateId}`,
        { headers: { Authorization: `${token}` } }
      );
      toast.success("Candidate deleted successfully");
      fetchCandidates(); // Refresh the list
    } catch (error) {
      console.error("Error deleting candidate:", error);
      toast.error(error.response?.data?.message || "Failed to delete candidate");
    }
  };

  // Get job title by ID or object
  const getJobTitle = (job) => {
    try {
      if (!job) return "N/A";

      // If job is an object with jobTitle property
      if (typeof job === 'object' && job !== null) {
        return safeString(job.jobTitle) || safeString(job.title) || "N/A";
      }

      // If job is a string ID, find in jobOptions
      if (typeof job === 'string') {
        const foundJob = jobOptions.find(j => j._id === job || j.id === job);
        return safeString(foundJob?.jobTitle) || safeString(foundJob?.title) || "N/A";
      }

      return "N/A";
    } catch (error) {
      console.error("Error in getJobTitle:", error, job);
      return "N/A";
    }
  };

  // Get job ID safely
  const getJobId = (job) => {
    try {
      if (!job) return "";

      // If job is an object with _id or id property
      if (typeof job === 'object' && job !== null) {
        return safeString(job._id) || safeString(job.id) || "";
      }

      // If job is a string ID
      if (typeof job === 'string') {
        return job;
      }

      return "";
    } catch (error) {
      console.error("Error in getJobId:", error, job);
      return "";
    }
  };

  const COLUMNS = useMemo(
    () => [
      {
        Header: "Candidate Name",
        accessor: "candidateName",
        Cell: ({ row }) => {
          try {
            const name = safeString(row.original.candidateName, "Unknown");
            const email = safeString(row.original.email, "No email");
            return (
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#4669FA] to-[#ae5ff4] flex items-center justify-center text-white font-medium mr-3">
                  {name ? name.charAt(0).toUpperCase() : "?"}
                </div>
                <div>
                  <div className="font-medium text-slate-900">{name}</div>
                  <div className="text-xs text-slate-500">{email}</div>
                </div>
              </div>
            );
          } catch (error) {
            console.error("Error in Candidate Name cell:", error);
            return <div>Error loading name</div>;
          }
        },
      },
      {
        Header: "Applied Job",
        accessor: "appliedJob",
        Cell: ({ value }) => {
          try {
            const jobTitle = getJobTitle(value);
            const jobId = getJobId(value);
            return (
              <div>
                <div className="text-sm text-slate-700">{jobTitle}</div>
                {/* {jobId && (
                  <div className="text-xs text-slate-500">ID: {jobId.substring(0, 8)}...</div>
                )} */}
              </div>
            );
          } catch (error) {
            console.error("Error in Applied Job cell:", error);
            return <div>Error loading job</div>;
          }
        },
      },
      {
        Header: "Experience",
        accessor: "experience",
        Cell: ({ value }) => {
          try {
            const exp = safeString(value);
            return (
              <span className="text-sm text-slate-600">
                {exp ? `${exp} years` : "Not specified"}
              </span>
            );
          } catch (error) {
            return <span>Error</span>;
          }
        },
      },
      {
        Header: "CV Match %",
        accessor: "cvMatchPercent",
        Cell: ({ value }) => {
          try {
            const score = Number(value) || 0;
            return (
              <div className="flex items-center">
                <div className="w-16 bg-slate-200 rounded-full h-2 mr-3">
                  <div
                    className={`h-2 rounded-full ${score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                    style={{ width: `${score}%` }}
                  ></div>
                </div>
                <span className={`font-medium ${score >= 80 ? 'text-emerald-700' : score >= 60 ? 'text-amber-700' : 'text-red-700'
                  }`}>
                  {score}%
                </span>
              </div>
            );
          } catch (error) {
            return <span>0%</span>;
          }
        },
      },
      {
        Header: "AI Score",
        accessor: "aiScore",
        Cell: ({ value }) => {
          try {
            const score = Number(value) || 0;
            return (
              <div>
                <div className="text-lg font-bold text-slate-900">{score}</div>
                <div className="text-xs text-slate-500">/100</div>
              </div>
            );
          } catch (error) {
            return <div>0</div>;
          }
        },
      },
      {
        Header: "Interview Status",
        accessor: "interviewStatus",
        Cell: ({ value }) => {
          try {
            // Log the actual value for debugging
            console.log("InterviewStatus raw value:", value, "Type:", typeof value);

            const status = safeLowerCase(value, "pending");
            const displayStatus = safeString(value, "Pending");

            const statusColors = {
              pending: "bg-amber-100 text-amber-800 border-amber-200",
              passed: "bg-emerald-100 text-emerald-800 border-emerald-200",
              rejected: "bg-red-100 text-red-800 border-red-200",
              scheduled: "bg-blue-100 text-blue-800 border-blue-200",
              "in progress": "bg-purple-100 text-purple-800 border-purple-200",
              completed: "bg-emerald-100 text-emerald-800 border-emerald-200"
            };

            const dotColors = {
              pending: "bg-amber-500",
              passed: "bg-emerald-500",
              rejected: "bg-red-500",
              scheduled: "bg-blue-500",
              "in progress": "bg-purple-500",
              completed: "bg-emerald-500"
            };

            return (
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${statusColors[status] || "bg-slate-100 text-slate-800"
                }`}>
                <span className={`w-2 h-2 rounded-full mr-2 ${dotColors[status] || "bg-slate-500"
                  }`}></span>
                {displayStatus}
              </span>
            );
          } catch (error) {
            console.error("Error in Interview Status cell:", error, value);
            return <span className="bg-slate-100 text-slate-800 px-3 py-1 rounded-full">Error</span>;
          }
        },
      },
      {
        Header: "Recommendation",
        accessor: "recommendation",
        Cell: ({ value }) => {
          try {
            // Log the actual value for debugging
            console.log("Recommendation raw value:", value, "Type:", typeof value);

            const rec = safeLowerCase(value, "neutral");
            const displayRec = safeString(value, "Pending Review");

            const recColors = {
              hire: "bg-emerald-100 text-emerald-800 border-emerald-200",
              "strong hire": "bg-emerald-100 text-emerald-800 border-emerald-200",
              review: "bg-amber-100 text-amber-800 border-amber-200",
              reject: "bg-red-100 text-red-800 border-red-200",
              neutral: "bg-slate-100 text-slate-800 border-slate-200"
            };

            return (
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${recColors[rec] || "bg-slate-100 text-slate-800"
                }`}>
                {displayRec}
              </span>
            );
          } catch (error) {
            console.error("Error in Recommendation cell:", error, value);
            return <span className="bg-slate-100 text-slate-800 px-3 py-1 rounded-full">Error</span>;
          }
        },
      },
      {
        Header: "Actions",
        accessor: "_id",
        Cell: ({ row }) => (
          <div className="flex space-x-3">
            <Tippy content="Process AI Score">
              <button
                className="action-btn"
                onClick={() => processSingleCandidate(row.original._id)}
                disabled={processingCandidateId === row.original._id}
              >
                {processingCandidateId === row.original._id ? (
                  <Icon icon="eos-icons:loading" className="w-5 h-5 text-blue-600 animate-spin" />
                ) : (
                  <Icon icon="heroicons:sparkles-solid" className="w-5 h-5 text-blue-600" />
                )}
              </button>
            </Tippy>
            <Tippy content="Delete">
              <button
                className="action-btn"
                onClick={() => handleAction("delete", row)}
              >
                <Icon icon="heroicons-outline:trash" className="w-5 h-5 text-red-600" />
              </button>
            </Tippy>
          </div>
        ),
      },
    ],
    [jobOptions]
  );

  // Filter data based on search
  const filteredData = useMemo(() => {
    try {
      if (!Array.isArray(candidates) || candidates.length === 0) return [];

      if (!searchQuery) return candidates;

      return candidates.filter(candidate => {
        const name = safeLowerCase(candidate?.candidateName);
        const email = safeLowerCase(candidate?.email);
        const jobTitle = getJobTitle(candidate?.appliedJob).toLowerCase();
        const query = searchQuery.toLowerCase();

        return name.includes(query) || email.includes(query) || jobTitle.includes(query);
      });
    } catch (error) {
      console.error("Error in filteredData:", error);
      return [];
    }
  }, [searchQuery, candidates, jobOptions]);

  const data = useMemo(() => filteredData, [filteredData]);

  const tableInstance = useTable(
    {
      columns: COLUMNS,
      data: data,
      initialState: { pageIndex: 0, pageSize: limit }
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: 'selection',
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <input
              type="checkbox"
              {...getToggleAllRowsSelectedProps()}
              className="h-4 w-4 text-blue-600 border-slate-300 rounded"
            />
          ),
          Cell: ({ row }) => (
            <input
              type="checkbox"
              {...row.getToggleRowSelectedProps()}
              className="h-4 w-4 text-blue-600 border-slate-300 rounded"
            />
          ),
        },
        ...columns,
      ]);
    }
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page: tablePage,
    prepareRow,
    canPreviousPage,
    canNextPage,
    previousPage,
    nextPage,
    gotoPage,
    state: { pageIndex },
  } = tableInstance;

  return (
    <div>
      {/* Header Section */}
      <div className="md:flex md:justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Candidate Management</h1>
          <p className="text-slate-600">
            View and manage all candidates, filter by various criteria, and take quick actions.
          </p>
        </div>
        {/* <div className="mt-4 md:mt-0">
          <Button
            className="btn-md bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={() => navigate("/add-candidates")}
          >
            <Icon icon="heroicons-outline:user-add" className="w-4 h-4 mr-2" />
            Add Candidate
          </Button>
        </div> */}
      </div>

      {/* Action Bar */}
      <Card noborder>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h4 className="text-lg font-semibold text-slate-900 mb-2">Candidate List</h4>
            <div className="relative">
              <input
                type="text"
                placeholder="Search candidates by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-slate-200 rounded-lg px-4 py-2 pl-10 w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Icon
                icon="heroicons-outline:search"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5"
              />
            </div>
          </div>

          {/* <div className="flex gap-3">
            <Button
              className={`${selectedRows.length === 0 ? 'border border-blue-500' : 'bg-blue-600 hover:bg-blue-700'} text-black rounded-lg`}
              disabled={selectedRows.length === 0}
            >
              <Icon icon="heroicons-outline:pencil" className="w-4 h-4 mr-2" />
              <span>Edit Selected</span>
            </Button>
            <Button
              className={`${selectedRows.length === 0 ? 'border border-red-500' : 'bg-red-600 hover:bg-red-700'} text-black rounded-lg`}
              disabled={selectedRows.length === 0}
            >
              <Icon icon="heroicons-outline:trash" className="w-4 h-4 mr-2" />
              <span>Delete Selected</span>
            </Button>
          </div> */}

          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div className="relative">
                <select
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="border border-slate-300 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full appearance-none bg-white"
                  style={{ paddingLeft: '1rem', paddingRight: '2.5rem' }}
                >
                  <option value="">Select Job</option>
                  {jobOptions.map((job) => (
                    <option key={job._id} value={job._id}>
                      {safeString(job.jobTitle) || safeString(job.title)}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            <Button
              className={`${processingBatch ? 'bg-blue-700 cursor-not-allowed' : 'border border-blue-500'} text-blue-600 rounded-lg`}
              disabled={processingBatch}
              onClick={() => {
                if (selectedJobId) {
                  batchProcessCandidates(selectedJobId);
                } else {
                  toast.error("Please select a job to process candidates");
                }
              }}
            >
              {processingBatch ? (
                <>
                  <Icon icon="eos-icons:loading" className="w-4 h-4 mr-2 animate-spin inline text-white" />
                  <span className="text-white">Processing...</span>
                </>
              ) : (
                <>
                  <Icon icon="heroicons:rocket-launch" className="w-4 h-4 mr-2 inline" />
                  <span>Get AI Insights</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto -mx-6">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              <table
                className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700"
                {...getTableProps()}
              >
                <thead className="border-t border-slate-100 dark:border-slate-800 bg-gradient-to-r from-[#4669FA] to-[#ae5ff4]">
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps(column.getSortByToggleProps())}
                          className="table-th whitespace-nowrap"
                        >
                          {column.render("Header")}
                          <span>
                            {column.isSorted
                              ? column.isSortedDesc
                                ? " 🔽"
                                : " 🔼"
                              : ""}
                          </span>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()} className="text-left">
                  {loading ? (
                    <tr>
                      <td colSpan={COLUMNS.length + 1} className="py-10">
                        <div className="flex justify-center items-center">
                          <img
                            src={Loader}
                            alt="Loading..."
                            className="w-60 h-16"
                          />
                        </div>
                      </td>
                    </tr>
                  ) : tablePage.length > 0 ? (
                    tablePage.map((row) => {
                      prepareRow(row);
                      return (
                        <tr {...row.getRowProps()} className="hover:bg-slate-50">
                          {row.cells.map((cell) => (
                            <td {...cell.getCellProps()} className="table-td border-b">
                              {cell.render("Cell")}
                            </td>
                          ))}
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={COLUMNS.length + 1} className="py-6 text-center text-gray-500">
                        No candidates found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pagination */}
        {data.length > 0 && !loading && (
          <div className="md:flex md:space-y-0 space-y-5 justify-between mt-6 items-center">
            {/* Go to page */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-700 dark:text-slate-300">
                Go to page:
              </span>
              <input
                type="number"
                min="1"
                max={pages}
                value={page}
                onChange={(e) => {
                  const newPage = Number(e.target.value);
                  if (newPage >= 1 && newPage <= pages) {
                    setPage(newPage);
                    gotoPage(newPage - 1);
                  }
                }}
                className="w-16 border rounded-md px-2 py-1 text-center dark:bg-slate-800 dark:text-white"
              />
              <span className="text-slate-700 dark:text-slate-300">
                Page <strong>{page}</strong> of {pages}
              </span>
              <span className="text-slate-700 dark:text-slate-300">
                | Total {total} candidates
              </span>
            </div>

            {/* Page numbers and navigation */}
            <ul className="flex items-center space-x-3 rtl:space-x-reverse">
              {/* First Page */}
              <li className="text-xl text-slate-900 dark:text-white rtl:rotate-180">
                <button
                  onClick={() => {
                    setPage(1);
                    gotoPage(0);
                  }}
                  disabled={page === 1}
                >
                  <Icon icon="heroicons:chevron-double-left-solid" />
                </button>
              </li>

              {/* Previous */}
              <li>
                <button
                  onClick={() => {
                    setPage((p) => Math.max(1, p - 1));
                    previousPage();
                  }}
                  disabled={page === 1}
                >
                  Prev
                </button>
              </li>

              {/* Page Numbers */}
              {Array.from({ length: pages }, (_, i) => i + 1).map((num) => (
                <li key={num}>
                  <button
                    className={`text-sm rounded px-3 py-1 ${num === page
                        ? "bg-slate-900 text-white dark:bg-slate-600 dark:text-slate-200 font-medium"
                        : "bg-slate-100 text-slate-900 dark:bg-slate-700 dark:text-slate-400 font-normal"
                      }`}
                    onClick={() => {
                      setPage(num);
                      gotoPage(num - 1);
                    }}
                  >
                    {num}
                  </button>
                </li>
              ))}

              {/* Next */}
              <li>
                <button
                  onClick={() => {
                    setPage((p) => Math.min(pages, p + 1));
                    nextPage();
                  }}
                  disabled={page === pages}
                >
                  Next
                </button>
              </li>

              {/* Last Page */}
              <li className="text-xl text-slate-900 dark:text-white rtl:rotate-180">
                <button
                  onClick={() => {
                    setPage(pages);
                    gotoPage(pages - 1);
                  }}
                  disabled={page === pages}
                >
                  <Icon icon="heroicons:chevron-double-right-solid" />
                </button>
              </li>
            </ul>

            {/* Page size selector */}
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Show</span>
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="form-select py-2"
              >
                {[5, 10, 20, 30, 40].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        activeModal={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Delete"
        themeClass="bg-gradient-to-r from-[#3AB89D] to-[#3A90B8]"
        centered
        footerContent={
          <div className="flex justify-between w-full">
            <Button text="Cancel" className="btn-light" onClick={() => setDeleteModalOpen(false)} />
            <Button
              text="Delete"
              className="btn-danger"
              onClick={async () => {
                await handleDeleteCandidate(selectedCandidateId);
                setDeleteModalOpen(false);
              }}
            />
          </div>
        }
      >
        <p className="text-gray-700 text-center">
          Are you sure you want to delete this candidate? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default Candidates;