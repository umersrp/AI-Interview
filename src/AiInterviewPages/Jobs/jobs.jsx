import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import Tippy from "@tippyjs/react";
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
import Modal from "@/components/ui/Modal";
import 'tippy.js/themes/light.css';

const Jobs = () => {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
const [selectedJobId, setSelectedJobId] = useState(null);

  // Pagination states
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pages, setPages] = useState(1);

  // Fetch jobs from API
  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/jobs/GetAll?page=${page}&limit=${limit}`,
        { headers: { Authorization: `${token}` } }
      );

      console.log("Jobs API Response:", response.data);

      // Handle different response structures
      const jobsData = response.data?.data?.jobs || response.data?.data || [];
      setJobs(jobsData);

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
      console.error("Error fetching jobs:", error);
      setError("Failed to load jobs");
      toast.error(error.response?.data?.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Handle job actions
  const handleAction = async (action, row) => {
    const jobId = row.original._id || row.original.id;
    
    if (action === "edit") {
      navigate(`/add-job/${jobId}`);
    }
    if (action === "view") {
      navigate(`/add-job/${jobId}`, { state: { jobData: row.original } });
    }
    if (action === "close") {
      try {
        const token = localStorage.getItem("token");
        await axios.put(
          `${import.meta.env.VITE_APP_BASE_URL}/jobs/${jobId}`,
          { ...row.original, status: "closed" },
          { headers: { Authorization: `${token}` } }
        );
        toast.success("Job closed successfully");
        fetchJobs(); // Refresh the list
      } catch (error) {
        console.error("Error closing job:", error);
        toast.error(error.response?.data?.message || "Failed to close job");
      }
    }
   if (action === "delete") {
  setSelectedJobId(jobId);
  setDeleteModalOpen(true);
}
  };

  const handleDeleteJob = async (jobId) => {
  try {
    const token = localStorage.getItem("token");
    await axios.delete(
      `${import.meta.env.VITE_APP_BASE_URL}/jobs/${jobId}`,
      { headers: { Authorization: `${token}` } }
    );
    toast.success("Job deleted successfully");
    fetchJobs(); // Refresh the list
  } catch (error) {
    console.error("Error deleting job:", error);
    toast.error(error.response?.data?.message || "Failed to delete job");
  }
};

  const COLUMNS = useMemo(
    () => [
      {
        Header: "Job Title",
        accessor: "jobTitle",
        Cell: ({ row }) => (
          <div>
            <div className="font-medium text-slate-900">{row.original.jobTitle}</div>
            <div className="text-xs text-slate-500">{row.original.location || "Remote"}</div>
          </div>
        ),
      },
      {
        Header: "Department",
        accessor: "department",
        Cell: ({ row }) => (
          <div>
            <div className="text-sm text-slate-700">{row.original.department}</div>
            <div className="text-xs text-slate-500">{row.original.employmentType || "Full-time"}</div>
          </div>
        ),
      },
      {
        Header: "Required Skills",
        accessor: "requiredSkills",
        Cell: ({ value }) => (
          <div className="flex flex-wrap gap-1">
            {Array.isArray(value) ? (
              value.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-500">No skills listed</span>
            )}
            {Array.isArray(value) && value.length > 3 && (
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                +{value.length - 3} more
              </span>
            )}
          </div>
        ),
      },
      {
        Header: "Experience",
        accessor: "experience",
        Cell: ({ value }) => (
          <span className="text-sm text-slate-600">{value ? `${value} years` : "Not specified"}</span>
        ),
      },
      {
        Header: "Interview Type",
        accessor: "interviewType",
        Cell: ({ value }) => (
          <div className="flex items-center">
            <Icon
              icon={value?.toLowerCase() === "voice" ? "heroicons-outline:microphone" : 
                     value?.toLowerCase() === "video" ? "heroicons-outline:video-camera" : 
                     "heroicons-outline:chat-bubble-left-right"}
              className={`w-4 h-4 mr-2 ${
                value?.toLowerCase() === "voice" ? "text-blue-600" : 
                value?.toLowerCase() === "video" ? "text-purple-600" : 
                "text-green-600"
              }`}
            />
            <span className="capitalize">{value || "Not specified"}</span>
          </div>
        ),
      },
      {
        Header: "AI Weightage",
        accessor: "aiWeightage",
        Cell: ({ value }) => {
          if (!value) return <span className="text-sm text-gray-500">Not set</span>;
          return (
            <div className="space-y-1 min-w-[120px]">
              <div className="flex items-center justify-between text-xs">
                <span>Skills</span>
                <span className="font-medium">{value.skills || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-blue-600 h-1.5 rounded-full"
                  style={{ width: `${value.skills || 0}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span>Communication</span>
                <span className="font-medium">{value.communication || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-green-600 h-1.5 rounded-full"
                  style={{ width: `${value.communication || 0}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span>Experience</span>
                <span className="font-medium">{value.experience || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-purple-600 h-1.5 rounded-full"
                  style={{ width: `${value.experience || 0}%` }}
                ></div>
              </div>
            </div>
          );
        },
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => (
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            value?.toLowerCase() === "active"
              ? "bg-green-100 text-green-800"
              : value?.toLowerCase() === "closed"
              ? "bg-red-100 text-red-800"
              : "bg-gray-100 text-gray-800"
            }`}>
            <span className={`w-2 h-2 rounded-full mr-2 ${
              value?.toLowerCase() === "active" ? "bg-green-500" : 
              value?.toLowerCase() === "closed" ? "bg-red-500" : 
              "bg-gray-500"
            }`}></span>
            {value || "Unknown"}
          </span>
        ),
      },//applicationLink
      {
      Header: "Application Link",
      accessor: "applicationLink",
      Cell: ({ value }) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [copied, setCopied] = useState(false);
        
        const handleCopy = async () => {
          try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            toast.success("Application link copied to clipboard!");
            
            // Reset copied state after 2 seconds
            setTimeout(() => setCopied(false), 2000);
          } catch (err) {
            console.error("Failed to copy:", err);
            toast.error("Failed to copy link");
          }
        };
        
        if (!value) {
          return <span className="text-sm text-gray-400">No link</span>;
        }
        
        return (
          <div className="flex items-center space-x-2 max-w-[250px]">
            <span className="text-xs text-slate-500 truncate" title={value}>
              {value}
            </span>
            <Tippy content={copied ? "Copied!" : "Copy link"} theme="light">
              <button
                onClick={handleCopy}
                className="p-1 hover:bg-slate-100 rounded-full transition-colors flex-shrink-0"
              >
                {copied ? (
                  <Icon icon="heroicons:check" className="w-4 h-4 text-green-600" />
                ) : (
                  <Icon icon="heroicons:clipboard" className="w-4 h-4 text-blue-600" />
                )}
              </button>
            </Tippy>
          </div>
        );
      },
    },
      {
        Header: "Actions",
        accessor: "_id",
        Cell: ({ row }) => (
          <div className="flex space-x-3">
            <Tippy content="View">
              <button 
                className="action-btn"
                onClick={() => handleAction("view", row)}
              >
                <Icon icon="heroicons-outline:eye" className="text-green-600" />
              </button>
            </Tippy>
            <Tippy content="Edit">
              <button 
                className="action-btn"
                onClick={() => handleAction("edit", row)}
              >
                <Icon icon="heroicons:pencil-square" className="text-blue-600" />
              </button>
            </Tippy>
            <Tippy content="Close">
              <button 
                className="action-btn"
                onClick={() => handleAction("close", row)}
                disabled={row.original.status?.toLowerCase() === "closed"}
              >
                <Icon icon="heroicons-outline:lock-closed" className={`${row.original.status?.toLowerCase() === "closed" ? "text-gray-400" : "text-orange-600"}`} />
              </button>
            </Tippy>
            <Tippy content="Delete">
              <button 
                className="action-btn"
                onClick={() => handleAction("delete", row)}
              >
                <Icon icon="heroicons-outline:trash" className="text-red-600" />
              </button>
            </Tippy>
          </div>
        ),
      },
    ],
    []
  );

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!Array.isArray(jobs) || jobs.length === 0) return [];

    if (!searchQuery) return jobs;

    return jobs.filter(job =>
      job?.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job?.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (Array.isArray(job?.requiredSkills) &&
        job.requiredSkills.some(skill =>
          skill?.toLowerCase().includes(searchQuery.toLowerCase())
        ))
    );
  }, [searchQuery, jobs]);

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
    pageOptions,
    nextPage,
    previousPage,
    gotoPage,
    state: { pageIndex },
  } = tableInstance;

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage + 1);
    gotoPage(newPage);
  };

  return (
    <div>
      {/* Header Section */}
      <div className="md:flex md:justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Job Management</h1>
          <p className="text-slate-600">
            Manage active and closed job postings, configure AI interview flows.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button
            className="btn-md bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={() => navigate("/add-job")}
          >
            <Icon icon="heroicons-outline:briefcase" className="w-4 h-4 mr-2" />
            Create New Job
          </Button>
        </div>
      </div>

      {/* Action Bar */}
      <Card noborder>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h4 className="text-lg font-semibold text-slate-900 mb-2">Current Job Openings</h4>
            <div className="relative">
              <input
                type="text"
                placeholder="Search jobs by title or department..."
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

          <div className="flex gap-3">
            <Button
              className={`${selectedRows.length === 0 ? 'border border-black-500' : 'bg-blue-600 hover:bg-blue-700'} text-black rounded-lg `}
              disabled={selectedRows.length === 0}
            >
              <Icon icon="heroicons-outline:pencil" className="w-4 h-4 mr-2" />
              <span>Edit Selected</span>
            </Button>
            <Button
              className={`${selectedRows.length === 0 ? 'border border-red-500' : 'bg-gray-800 hover:bg-gray-900'} text-red-500 rounded-lg `}
              disabled={selectedRows.length === 0}
            >
              <Icon icon="heroicons-outline:lock-closed" className="w-4 h-4 mr-2" />
              <span>Close Selected</span>
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
              <td colSpan={COLUMNS.length} className="py-10">
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
                <tr {...row.getRowProps()}>
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
              <td colSpan={COLUMNS.length} className="py-6 text-center text-gray-500">
                No jobs found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
</div>

{/* Pagination */}
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
      | Total {total} jobs
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
          className={`text-sm rounded px-3 py-1 ${
            num === page
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
          await handleDeleteJob(selectedJobId);
          setDeleteModalOpen(false);
        }}
      />
    </div>
  }
>
  <p className="text-gray-700 text-center">
    Are you sure you want to delete this job? This action cannot be undone.
  </p>
</Modal>
      </Card>
    </div>
  );
};

export default Jobs;


