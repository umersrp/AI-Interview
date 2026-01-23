import React, { useState, useEffect, useMemo } from "react";
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

const Jobs = () => {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [jobs, setJobs] = useState([]);

  // Initialize jobs data from localStorage or default data
  useEffect(() => {
    const savedJobs = localStorage.getItem("jobsData");
    if (savedJobs) {
      setJobs(JSON.parse(savedJobs));
    } else {
      // Default sample data
      const defaultJobs = [
        {
          id: "1",
          jobTitle: "Frontend Developer",
          department: "Engineering",
          requiredSkills: ["React", "JavaScript", "CSS", "HTML"],
          experience: "Mid Level (2-5 years)",
          interviewType: "Voice",
          status: "Active",
          aiWeightage: { skills: 40, communication: 30, experience: 30 },
          location: "Remote",
          salaryRange: "$80,000 - $100,000",
          employmentType: "Full-time",
        },
        {
          id: "2",
          jobTitle: "UX Designer",
          department: "Design",
          requiredSkills: ["Figma", "UI/UX", "Prototyping", "User Research"],
          experience: "Senior Level (5-8 years)",
          interviewType: "Text",
          status: "Active",
          aiWeightage: { skills: 35, communication: 40, experience: 25 },
          location: "New York",
          salaryRange: "$90,000 - $120,000",
          employmentType: "Full-time",
        },
        {
          id: "3",
          jobTitle: "Product Manager",
          department: "Product",
          requiredSkills: ["Agile", "Scrum", "Product Strategy", "Roadmapping"],
          experience: "Senior Level (5-8 years)",
          interviewType: "Voice",
          status: "Active",
          aiWeightage: { skills: 30, communication: 40, experience: 30 },
          location: "San Francisco",
          salaryRange: "$120,000 - $150,000",
          employmentType: "Full-time",
        },
      ];
      setJobs(defaultJobs);
      localStorage.setItem("jobsData", JSON.stringify(defaultJobs));
    }
  }, []);

  // Save jobs to localStorage whenever jobs change
  useEffect(() => {
    if (jobs.length > 0) {
      localStorage.setItem("jobsData", JSON.stringify(jobs));
    }
  }, [jobs]);

  // Handle form submission from job-form
  useEffect(() => {
    const handleFormSubmit = (event) => {
      if (event.detail && event.detail.type === 'JOB_FORM_SUBMIT') {
        const newJob = event.detail.data;
        if (newJob.id) {
          // Edit existing job
          setJobs(prev => prev.map(job => 
            job.id === newJob.id ? newJob : job
          ));
        } else {
          // Add new job
          const jobWithId = {
            ...newJob,
            id: Date.now().toString(),
            status: "Active",
            aiWeightage: newJob.aiWeightage || { skills: 40, communication: 30, experience: 30 }
          };
          setJobs(prev => [...prev, jobWithId]);
        }
      }
    };

    window.addEventListener('jobFormSubmit', handleFormSubmit);
    return () => window.removeEventListener('jobFormSubmit', handleFormSubmit);
  }, []);

  const handleAction = (action, row) => {
    if (action === "edit") {
      navigate(`/job-form/${row.id}`, { state: { jobData: row.original } });
    }
    if (action === "view") {
      navigate(`/job-details/${row.id}`, { state: { jobData: row.original } });
    }
    if (action === "close") {
      setJobs(prev => prev.map(job => 
        job.id === row.original.id ? { ...job, status: "Closed" } : job
      ));
    }
    if (action === "delete") {
      if (window.confirm("Are you sure you want to delete this job?")) {
        setJobs(prev => prev.filter(job => job.id !== row.original.id));
      }
    }
  };

  const actions = [
    { name: "view", icon: "heroicons-outline:eye" },
    { name: "edit", icon: "heroicons:pencil-square" },
    { name: "close", icon: "heroicons-outline:lock-closed" },
    { name: "delete", icon: "heroicons-outline:trash" },
  ];

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
          <span className="text-sm text-slate-600">{value || "Not specified"}</span>
        ),
      },
      {
        Header: "Interview Type",
        accessor: "interviewType",
        Cell: ({ value }) => (
          <div className="flex items-center">
            <Icon
              icon={value === "Voice" || value === "voice" ? "heroicons-outline:microphone" : "heroicons-outline:chat-bubble-left-right"}
              className={`w-4 h-4 mr-2 ${value === "Voice" || value === "voice" ? "text-blue-600" : "text-green-600"}`}
            />
            <span>{value || "Not specified"}</span>
          </div>
        ),
      },
      {
        Header: "AI Weightage Summary",
        accessor: "aiWeightage",
        Cell: ({ value }) => {
          if (!value) return <span className="text-sm text-gray-500">Not set</span>;
          return (
            <div className="space-y-1">
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
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${value === "Active"
            ? "bg-green-100 text-green-800"
            : value === "Closed"
            ? "bg-red-100 text-red-800"
            : "bg-gray-100 text-gray-800"
            }`}>
            <span className={`w-2 h-2 rounded-full mr-2 ${value === "Active" ? "bg-green-500" : value === "Closed" ? "bg-red-500" : "bg-gray-500"
              }`}></span>
            {value || "Unknown"}
          </span>
        ),
      },
      {
        Header: "Actions",
        accessor: "id",
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
              >
                <Icon icon="heroicons-outline:lock-closed" className="text-orange-600" />
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
      initialState: { pageIndex: 0, pageSize: 5 }
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
    state: { pageIndex },
  } = tableInstance;

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
              {data.length === 0 ? (
                <div className="text-center py-12">
                  <Icon icon="heroicons-outline:briefcase" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                  <p className="text-gray-600">Try adjusting your search or create a new job posting.</p>
                </div>
              ) : (
                <table
                  className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700"
                  {...getTableProps()}
                >
                  <thead className="bg-slate-50 dark:bg-slate-700">
                    {headerGroups.map((headerGroup) => (
                      <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                          <th
                            {...column.getHeaderProps(column.getSortByToggleProps())}
                            className="table-th text-left py-3"
                          >
                            <div className="flex items-center">
                              {column.render("Header")}
                              <span className="ml-2">
                                {column.isSorted
                                  ? column.isSortedDesc
                                    ? <Icon icon="heroicons-outline:chevron-down" className="w-4 h-4" />
                                    : <Icon icon="heroicons-outline:chevron-up" className="w-4 h-4" />
                                  : <Icon icon="heroicons-outline:chevron-up-down" className="w-4 h-4 text-slate-400" />
                                }
                              </span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>

                  <tbody
                    className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700"
                    {...getTableBodyProps()}
                  >
                    {tablePage.map((row) => {
                      prepareRow(row);
                      return (
                        <tr {...row.getRowProps()} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                          {row.cells.map((cell) => (
                            <td {...cell.getCellProps()} className="table-td py-4">
                              {cell.render("Cell")}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Pagination */}
        {data.length > 0 && (
          <div className="flex flex-col md:flex-row justify-between items-center mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
            <div className="text-sm text-slate-600 dark:text-slate-300 mb-4 md:mb-0">
              Page {pageIndex + 1} of {pageOptions.length} | Total {data.length} jobs
            </div>

            <div className="flex items-center space-x-3">
              <Button
                onClick={previousPage}
                disabled={!canPreviousPage}
                className="px-4 py-2 border border-slate-200 rounded-lg disabled:opacity-50"
              >
                Previous
              </Button>
              <div className="flex items-center space-x-2">
                {pageOptions.map((page, idx) => (
                  <button
                    key={idx}
                    onClick={() => tableInstance.gotoPage(idx)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${pageIndex === idx
                        ? "bg-blue-600 text-white"
                        : "text-slate-600 hover:bg-slate-100"
                      }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
              <Button
                onClick={nextPage}
                disabled={!canNextPage}
                className="px-4 py-2 border border-slate-200 rounded-lg disabled:opacity-50"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Jobs;