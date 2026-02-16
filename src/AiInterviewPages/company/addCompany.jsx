import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import axios from "axios";
import { toast } from "react-toastify";
import { isValidEmail, isValidPhone } from "@/constant/validation";
import { useSelector } from "react-redux";

const AddCompany = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const mode = location.state?.mode || "add"; // add | view | edit
  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";

  const { user } = useSelector((state) => state.auth);
  const [tenants, setTenants] = useState([]);
  const [loadingTenants, setLoadingTenants] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    tenantId: "",
    // type: "company",
  });
  const [loading, setLoading] = useState(isViewMode || isEditMode);

  // Fetch tenants for dropdown (only for admin)
  useEffect(() => {
    const fetchTenants = async () => {
      if (user?.type === "admin") {
        try {
          setLoadingTenants(true);
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `${import.meta.env.VITE_APP_BASE_URL}/tenants?limit=100`,
            { headers: { Authorization: `${token}` } }
          );
          setTenants(response.data.data || []);
        } catch (error) {
          console.error("Error fetching tenants:", error);
          toast.error("Failed to load tenants");
        } finally {
          setLoadingTenants(false);
        }
      }
    };

    fetchTenants();
  }, [user?.type]);

  // For non-admin users, set tenantId automatically
  useEffect(() => {
    if (user?.type !== "admin" && user?.tenantId) {
      setFormData(prev => ({ ...prev, tenantId: user.tenantId }));
    }
  }, [user]);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/user/company/${id}`,
          { headers: { Authorization: `${token}` } }
        );
        const company = response.data.data;
        setFormData({
          email: company.email || "",
          password: "", // Don't populate password for security
          username: company.username || "",
          tenantId: company.tenantId || "",
          type: "company",
          phone: company.phone || "",
          address: company.address || "",
          website: company.website || "",
        });
      } catch (error) {
        toast.error("Error fetching company:", error);
      } finally {
        setLoading(false);
      }
    };

    if ((isViewMode || isEditMode) && id) fetchCompany();
  }, [id, isViewMode, isEditMode]);

  const handleInputChange = (e) => {
    if (isViewMode) return;
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
name
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isViewMode) return;

    // Validation

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!isValidEmail(formData.email)) {
      toast.error("Invalid email address");
      return;
    }
    if (!isEditMode && !formData.password) {
      toast.error("Password is required for new company");
      return;
    }
    if (!formData.username.trim()) {
      toast.error("Username is required");
      return;
    }
    if (!formData.tenantId && user?.type === "admin") {
      toast.error("Tenant is required");
      return;
    }


    // Prepare data for API
    const apiData = {
      email: formData.email,
      username: formData.username,
      tenantId: formData.tenantId,
      type: "company",
    };

    // Only include password if it's provided (for new company or password change)
    if (formData.password) {
      apiData.password = formData.password;
    }


    try {
      const token = localStorage.getItem("token");
      const loggedInUser = JSON.parse(localStorage.getItem("user"));

      if (isEditMode) {
        await axios.put(
          `${import.meta.env.VITE_APP_BASE_URL}/user/company/${id}`,
          { ...apiData, updatedBy: loggedInUser?.name },
          { headers: { "Content-Type": "application/json", Authorization: `${token}` } }
        );
        toast.success("Company updated successfully!");
      } else {
        await axios.post(
          `${import.meta.env.VITE_APP_BASE_URL}/user/company`,
          { ...apiData, createdBy: loggedInUser?.name },
          { headers: { "Content-Type": "application/json", Authorization: `${token}` } }
        );
        toast.success("Company created successfully!");
      }

      setTimeout(() => navigate("/company-listing"), 1200);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save company");
    }
  };

  if (loading) return <p>Loading company data...</p>;

  return (
    <div>
      <Card
        title={
          isViewMode ? "View Company" : isEditMode ? "Edit Company" : "Add Company"
        }
      >
        <form onSubmit={handleSubmit} className="p-4">
          {/* Grid Layout */}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
               <div>
              <label className="block text-sm font-medium mb-1">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className={`border p-2 w-full rounded ${isViewMode ? "bg-gray-100 cursor-not-allowed" : ""}`}
                readOnly={isViewMode}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`border p-2 w-full rounded ${isViewMode || isEditMode ? "bg-gray-100 cursor-not-allowed" : ""}`}
                readOnly={isViewMode || isEditMode}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Password {!isEditMode && <span className="text-red-500">*</span>}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`border p-2 w-full rounded ${isViewMode ? "bg-gray-100 cursor-not-allowed" : ""}`}
                readOnly={isViewMode}
                placeholder={isEditMode ? "Leave blank to keep current password" : "Enter password"}
                required={!isEditMode}
              />
              {isEditMode && (
                <p className="text-xs text-gray-500 mt-1">
                  Leave blank to keep current password
                </p>
              )}
            </div>

            {/* Tenant Selection - Only visible to admin */}
            {user?.type === "admin" && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tenant <span className="text-red-500">*</span>
                </label>
                <select
                  name="tenantId"
                  value={formData.tenantId}
                  onChange={handleInputChange}
                  className={`border p-2 w-full rounded ${isViewMode ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  disabled={isViewMode}
                  required
                >
                  <option value="">Select Tenant</option>
                  {loadingTenants ? (
                    <option disabled>Loading tenants...</option>
                  ) : (
                    tenants.map((tenant) => (
                      <option key={tenant._id} value={tenant._id}>
                        {tenant.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-6">
            <Button
              text={isViewMode ? "Back" : "Cancel"}
              className={isViewMode ? "btn-primary" : "btn-light"}
              type="button"
              onClick={() => navigate("/company-listing")}
            />
            {!isViewMode && (
              <Button
                text={isEditMode ? "Update Company" : "Create Company"}
                className="btn-primary"
                type="submit"
              />
            )}
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddCompany;