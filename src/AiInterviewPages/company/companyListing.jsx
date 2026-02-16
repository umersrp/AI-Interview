import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import {
  useTable,
  useRowSelect,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import GlobalFilter from "@/pages/table/react-tables/GlobalFilter";
import Button from "@/components/ui/Button";
import { toast } from "react-toastify";
import 'tippy.js/themes/light.css';
import Loader from "@/assets/images/logo/logo3.png";
import Modal from "@/components/ui/Modal";

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <input type="checkbox" ref={resolvedRef} {...rest} className="table-checkbox" />
    );
  }
);

const CompanyListing = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);

  // Pagination states
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pages, setPages] = useState(1);

  const handleDeleteCompany = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_APP_BASE_URL}/user/company/${id}`, {
        headers: { Authorization: `${token}` },
      });
      toast.success("Company deleted successfully");
      setCompanies((prev) => prev.filter((c) => c._id !== id));
    } catch (error) {
      console.error("Error deleting company:", error);
      toast.error(error.response?.data?.message || "Failed to delete company");
    }
  };

  // Handle row actions
  const handleAction = (action, row) => {
    if (action === "edit") {
      navigate(`/add-company/add/${row._id}`, { state: { mode: "edit" } });
    }
    if (action === "view") {
      navigate(`/add-company/add/${row._id}`, { state: { mode: "view" } });
    }
  };

  // Fetch Companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        // Simple URL without role-based filters
        const url = `${import.meta.env.VITE_APP_BASE_URL}/user/company?page=${page}&limit=${limit}`;

        const response = await axios.get(url, {
          headers: { Authorization: `${token}` },
        });

        console.log("API Response:", response.data); // Debug log

        // Extract companies from response
        const companiesData = response.data?.data?.companies || [];
        
        setCompanies(companiesData);

        // Update pagination from response
        if (response.data?.data) {
          const { total, page: currentPage, pages } = response.data.data;
          setTotal(total || 0);
          setPage(currentPage || 1);
          setPages(pages || 1);
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
        toast.error("Failed to load companies");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [page, limit]);

  const COLUMNS = useMemo(
    () => [
      {
        Header: "S.No",
        id: "serialNo",
        Cell: ({ row }) => <span>{row.index + 1 + (page - 1) * limit}</span>
      },
       { 
        Header: "Username", 
        accessor: "username",
        Cell: ({ value }) => value || "N/A"
      },
      {
        Header: "Email",
        accessor: "email",
        Cell: ({ value }) => (
          <span className="text-sm lowercase text-slate-600 dark:text-slate-300">
            {value || "N/A"}
          </span>
        ),
      },
      {
        Header: "Status",
        accessor: "isActive",
        Cell: ({ value }) => (
          <span
            className={`inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-full bg-opacity-5 ${
              value === true
                ? "text-[#9b5cda] bg-[#3042e6]"
                : "text-danger-500 bg-danger-500"
            }`}
          >
            {value === true ? "Active" : "Inactive"}
          </span>
        ),
      },
      {
        Header: "Created At",
        accessor: "createdAt",
        Cell: ({ value }) => (
          <span>{value ? new Date(value).toLocaleDateString("en-GB") : "N/A"}</span>
        ),
      },
      {
        Header: "Action",
        accessor: "action",
        Cell: ({ row }) => (
          <div className="flex space-x-3 rtl:space-x-reverse">
            <button
              className="action-btn"
              type="button"
              onClick={() => handleAction("view", row.original)}
              title="View"
            >
              <Icon icon="heroicons:eye" />
            </button>
            <button
              className="action-btn"
              type="button"
              onClick={() => handleAction("edit", row.original)}
              title="Edit"
            >
              <Icon icon="heroicons:pencil-square" />
            </button>
            <button
              className="action-btn"
              onClick={() => {
                setSelectedCompanyId(row.original._id);
                setDeleteModalOpen(true);
              }}
              title="Delete"
            >
              <Icon icon="heroicons:trash" className="text-red-600" />
            </button>
          </div>
        ),
      },
    ],
    [page, limit]
  );

  const data = useMemo(() => companies, [companies]);

  const tableInstance = useTable(
    { 
      columns: COLUMNS, 
      data,
      initialState: { pageIndex: 0, pageSize: limit }
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "selection",
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
          ),
          Cell: ({ row }) => (
            <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
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
    state,
    setGlobalFilter,
  } = tableInstance;

  const { globalFilter } = state;

  return (
    <div>
      <Card noborder>
        <div className="md:flex justify-between items-center mb-6">
          <h4 className="text-xl text-black-600">Company Listing</h4>
          <div className="flex items-center gap-3">
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
            <Button
              text="+ Add Company"
              className="btn-primary py-2 px-3"
              type="button"
              onClick={() => navigate("/add-company")}
            />
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
                <thead className="border-t border-slate-100 dark:border-slate-800 bg-gradient-to-r from-[#4669FA] to-[#ae5ff4] ">
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
                      <td colSpan={COLUMNS.length + 1} className="py-6 text-center text-gray-500">
                        No companies found
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
                if (newPage >= 1 && newPage <= pages) setPage(newPage);
              }}
              className="w-16 border rounded-md px-2 py-1 text-center dark:bg-slate-800 dark:text-white"
            />
            <span className="text-slate-700 dark:text-slate-300">
              Page <strong>{page}</strong> of {pages}
            </span>
            <span className="text-slate-700 dark:text-slate-300">
              | Total {total} companies
            </span>
          </div>

          {/* Page numbers and navigation */}
          <ul className="flex items-center space-x-3 rtl:space-x-reverse">
            {/* First Page */}
            <li className="text-xl text-slate-900 dark:text-white rtl:rotate-180">
              <button onClick={() => setPage(1)} disabled={page === 1}>
                <Icon icon="heroicons:chevron-double-left-solid" />
              </button>
            </li>

            {/* Previous */}
            <li>
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
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
                  onClick={() => setPage(num)}
                >
                  {num}
                </button>
              </li>
            ))}

            {/* Next */}
            <li>
              <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages}>
                Next
              </button>
            </li>

            {/* Last Page */}
            <li className="text-xl text-slate-900 dark:text-white rtl:rotate-180">
              <button onClick={() => setPage(pages)} disabled={page === pages}>
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
                await handleDeleteCompany(selectedCompanyId);
                setDeleteModalOpen(false);
              }}
            />
          </div>
        }
      >
        <p className="text-gray-700 text-center">
          Are you sure you want to delete this company? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default CompanyListing;