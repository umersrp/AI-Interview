import React, { useState, useEffect} from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { toast } from "react-toastify";
import axios from "axios";

const JobForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditMode);

  // Form state
  const [formData, setFormData] = useState({
    jobTitle: "",
    department: "",
    jobDescription: "",
    requiredSkills: [],
    experience: "",
    interviewType: "voice",
    status: "active",
    aiWeightage: {
      skills: 0,
      communication: 0,
      experience: 0,
    },
    responsibilities: "",
    qualifications: "",
    location: "",
    salaryRange: "",
    employmentType: "full-time",
  });

  const [errors, setErrors] = useState({});
  const [skillInput, setSkillInput] = useState("");

  // Common skills for suggestions
  const commonSkills = [
    "JavaScript", "React", "Node.js", "Python", "Java", "AWS",
    "UI/UX Design", "Project Management", "Agile/Scrum",
    "Communication", "Leadership", "Problem Solving"
  ];

  // Calculate total weightage
  const totalWeightage = Object.values(formData.aiWeightage).reduce((sum, val) => sum + val, 0);

  // Fetch job data if in edit mode
  useEffect(() => {
    const fetchJobData = async () => {
      if (isEditMode && id) {
        try {
          setFetchLoading(true);
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `${import.meta.env.VITE_APP_BASE_URL}/jobs/${id}`,
            { headers: { Authorization: `${token}` } }
          );
          
          const jobData = response.data.data;
          
          // Map API response to form state
          setFormData({
            jobTitle: jobData.jobTitle || "",
            department: jobData.department || "",
            jobDescription: jobData.jobDescription || "",
            requiredSkills: jobData.requiredSkills || [],
            experience: jobData.experience?.toString() || "",
            interviewType: jobData.interviewType?.toLowerCase() || "voice",
            status: jobData.status?.toLowerCase() || "active",
            aiWeightage: jobData.aiWeightage || { skills: 0, communication: 0, experience: 0 },
            responsibilities: jobData.responsibilities || "",
            qualifications: jobData.qualifications || "",
            location: jobData.location || "",
            salaryRange: jobData.salaryRange || "",
            employmentType: jobData.employmentType?.toLowerCase() || "full-time",
          });
        } catch (error) {
          console.error("Error fetching job:", error);
          toast.error(error.response?.data?.message || "Failed to load job data");
          navigate("/job-listing");
        } finally {
          setFetchLoading(false);
        }
      }
    };

    fetchJobData();
  }, [isEditMode, id, navigate]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Handle AI weightage changes
  const handleWeightageChange = (field, value) => {
    const newValue = parseInt(value) || 0;
    const newWeightage = { ...formData.aiWeightage, [field]: newValue };
    
    // Check if total exceeds 100
    const total = Object.values(newWeightage).reduce((sum, val) => sum + val, 0);
    if (total > 100) {
      setErrors(prev => ({
        ...prev,
        aiWeightage: "Total weightage cannot exceed 100%"
      }));
      return;
    }
    
    setErrors(prev => ({ ...prev, aiWeightage: "" }));
    setFormData(prev => ({
      ...prev,
      aiWeightage: newWeightage
    }));
  };

  // Handle skill input
  const handleAddSkill = (skill) => {
    const skillToAdd = skill || skillInput.trim();
    if (skillToAdd && !formData.requiredSkills.includes(skillToAdd)) {
      setFormData(prev => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, skillToAdd]
      }));
      setSkillInput("");
      // Clear requiredSkills error if skills are added
      if (errors.requiredSkills) {
        setErrors(prev => ({ ...prev, requiredSkills: "" }));
      }
    }
  };

  // Remove skill
  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter(skill => skill !== skillToRemove)
    }));
    // If no skills left, set error
    if (formData.requiredSkills.length <= 1) {
      setErrors(prev => ({ ...prev, requiredSkills: "At least one skill is required" }));
    }
  };

  // Handle skill key press
  const handleSkillKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = "Job title is required";
    }
    if (!formData.department) {
      newErrors.department = "Department is required";
    }
    if (!formData.jobDescription.trim()) {
      newErrors.jobDescription = "Job description is required";
    }
    if (formData.requiredSkills.length === 0) {
      newErrors.requiredSkills = "At least one skill is required";
    }
    if (!formData.experience) {
      newErrors.experience = "Experience level is required";
    }

    // Validate AI weightage totals
    if (totalWeightage !== 100) {
      newErrors.aiWeightage = "AI weightage must total 100%";
    }

    // Validate experience is a number (since API expects number)
    if (formData.experience && isNaN(parseInt(formData.experience))) {
      newErrors.experience = "Experience must be a number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    setLoading(true);

    // Prepare data for API
    const apiData = {
      jobTitle: formData.jobTitle,
      department: formData.department,
      jobDescription: formData.jobDescription,
      requiredSkills: formData.requiredSkills,
      experience: parseInt(formData.experience), // Convert to number
      interviewType: formData.interviewType,
      responsibilities: formData.responsibilities || "Not specified",
      qualifications: formData.qualifications || "Not specified",
      location: formData.location || "Not specified",
      salaryRange: formData.salaryRange || "Not specified",
      employmentType: formData.employmentType,
      aiWeightage: {
        skills: parseInt(formData.aiWeightage.skills) || 0,
        communication: parseInt(formData.aiWeightage.communication) || 0,
        experience: parseInt(formData.aiWeightage.experience) || 0,
      }
    };

    try {
      const token = localStorage.getItem("token");
      
      if (isEditMode) {
        // Update existing job
        await axios.put(
          `${import.meta.env.VITE_APP_BASE_URL}/jobs/${id}`,
          apiData,
          { headers: { Authorization: `${token}`, "Content-Type": "application/json" } }
        );
        toast.success("Job updated successfully!");
      } else {
        // Create new job
        await axios.post(
          `${import.meta.env.VITE_APP_BASE_URL}/jobs/Create`,
          apiData,
          { headers: { Authorization: `${token}`, "Content-Type": "application/json" } }
        );
        toast.success("Job created successfully!");
      }
      
      // Navigate back to jobs listing
      setTimeout(() => navigate("/job-listing"), 1200);
    } catch (error) {
      console.error("Error saving job:", error);
      toast.error(error.response?.data?.message || "Failed to save job");
      
      // Handle field-specific errors from API
      if (error.response?.data?.errors) {
        const apiErrors = {};
        error.response.data.errors.forEach(err => {
          apiErrors[err.field] = err.message;
        });
        setErrors(apiErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate("/job-listing");
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/job-listing")}
          className="flex items-center text-slate-600 hover:text-slate-900 mb-4"
        >
          <span className="mr-2">←</span> Back to Jobs
        </button>
        <h1 className="text-2xl font-bold text-slate-900">
          {isEditMode ? "Edit Job Posting" : "Create New Job"}
        </h1>
        <p className="text-slate-600">
          {isEditMode
            ? "Update the job details and requirements"
            : "Fill in the details to create a new job posting"}
        </p>
      </div>

      <Card title={`${isEditMode ? "Edit" : "Create"} Job Posting`}>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information Section */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title *
              </label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
                placeholder="e.g., Senior Frontend Developer"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.jobTitle ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.jobTitle && (
                <p className="text-red-500 text-sm mt-1">{errors.jobTitle}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department *
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.department ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Department</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Product">Product</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                  <option value="Operations">Operations</option>
                </select>
                {errors.department && (
                  <p className="text-red-500 text-sm mt-1">{errors.department}</p>
                )}
              </div>

              {/* Experience Level - Now as number input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience (Years) *
                </label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  min="0"
                  max="30"
                  placeholder="e.g., 3"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.experience ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.experience && (
                  <p className="text-red-500 text-sm mt-1">{errors.experience}</p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Remote, New York"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.location ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.location && (
                  <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                )}
              </div>

              {/* Salary Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salary Range *
                </label>
                <input
                  type="text"
                  name="salaryRange"
                  value={formData.salaryRange}
                  onChange={handleInputChange}
                  placeholder="e.g., 80,000 - 120,000"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.salaryRange ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.salaryRange && (
                  <p className="text-red-500 text-sm mt-1">{errors.salaryRange}</p>
                )}
              </div>

              {/* Employment Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employment Type *
                </label>
                <select
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.employmentType ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
                {errors.employmentType && (
                  <p className="text-red-500 text-sm mt-1">{errors.employmentType}</p>
                )}
              </div>

              {/* Interview Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interview Type *
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="interviewType"
                      value="voice"
                      checked={formData.interviewType === "voice"}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span>Voice</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="interviewType"
                      value="text"
                      checked={formData.interviewType === "text"}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span>Text</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="interviewType"
                      value="video"
                      checked={formData.interviewType === "video"}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span>Video</span>
                  </label>
                </div>
                {errors.interviewType && (
                  <p className="text-red-500 text-sm mt-1">{errors.interviewType}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            {/* Job Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Description *
              </label>
              <textarea
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleInputChange}
                rows={4}
                placeholder="Describe the role, expectations, and day-to-day responsibilities..."
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.jobDescription ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.jobDescription && (
                <p className="text-red-500 text-sm mt-1">{errors.jobDescription}</p>
              )}
            </div>

            {/* Required Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Required Skills *
              </label>
              
              {/* Skill Input */}
              <div className="mb-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={handleSkillKeyPress}
                    placeholder="Type a skill and press Enter"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Button
                    type="button"
                    className="btn-primary"
                    onClick={() => handleAddSkill()}
                    disabled={!skillInput.trim()}
                  >
                    Add
                  </Button>
                </div>
                
                {/* Skill Suggestions */}
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-1">Common skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {commonSkills
                      .filter(skill => 
                        !formData.requiredSkills.includes(skill) && 
                        (!skillInput || skill.toLowerCase().includes(skillInput.toLowerCase()))
                      )
                      .slice(0, 8)
                      .map(skill => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => handleAddSkill(skill)}
                          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                        >
                          {skill} +
                        </button>
                      ))
                    }
                  </div>
                </div>
              </div>
              
              {/* Selected Skills */}
              <div className={`border rounded-lg p-3 min-h-[60px] ${
                errors.requiredSkills ? 'border-red-500' : 'border-gray-300'
              }`}>
                {formData.requiredSkills.length === 0 ? (
                  <p className="text-gray-500 text-center py-2">No skills added yet</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {formData.requiredSkills.map(skill => (
                      <div
                        key={skill}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {errors.requiredSkills && (
                <p className="text-red-500 text-sm mt-1">{errors.requiredSkills}</p>
              )}
            </div>

            {/* AI Evaluation Weightage */}
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">AI Evaluation Weightage *</h3>
                  <p className="text-sm text-gray-600">Set the weight distribution for candidate evaluation</p>
                </div>
                <div className={`px-3 py-1 rounded-full ${totalWeightage === 100 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  Total: {totalWeightage}%
                </div>
              </div>
              
              {errors.aiWeightage && (
                <p className="text-red-500 text-sm mb-4">{errors.aiWeightage}</p>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Skills Weightage */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="font-medium text-gray-700">Skills</label>
                    <span className="text-lg font-semibold text-blue-600">{formData.aiWeightage.skills}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.aiWeightage.skills}
                    onChange={(e) => handleWeightageChange("skills", e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                {/* Communication Weightage */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="font-medium text-gray-700">Communication</label>
                    <span className="text-lg font-semibold text-green-600">{formData.aiWeightage.communication}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.aiWeightage.communication}
                    onChange={(e) => handleWeightageChange("communication", e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                {/* Experience Weightage */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="font-medium text-gray-700">Experience</label>
                    <span className="text-lg font-semibold text-purple-600">{formData.aiWeightage.experience}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.aiWeightage.experience}
                    onChange={(e) => handleWeightageChange("experience", e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
              
              {/* Visual Representation */}
              <div className="mt-6">
                <div className="flex h-4 rounded-lg overflow-hidden">
                  <div 
                    className="bg-blue-500 transition-all duration-300"
                    style={{ width: `${formData.aiWeightage.skills}%` }}
                    title={`Skills: ${formData.aiWeightage.skills}%`}
                  />
                  <div 
                    className="bg-green-500 transition-all duration-300"
                    style={{ width: `${formData.aiWeightage.communication}%` }}
                    title={`Communication: ${formData.aiWeightage.communication}%`}
                  />
                  <div 
                    className="bg-purple-500 transition-all duration-300"
                    style={{ width: `${formData.aiWeightage.experience}%` }}
                    title={`Experience: ${formData.aiWeightage.experience}%`}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Skills</span>
                  <span>Communication</span>
                  <span>Experience</span>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Responsibilities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Key Responsibilities *
                </label>
                <textarea
                  name="responsibilities"
                  value={formData.responsibilities}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="List the main responsibilities of this role..."
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.responsibilities ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.responsibilities && (
                  <p className="text-red-500 text-sm mt-1">{errors.responsibilities}</p>
                )}
              </div>

              {/* Qualifications */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Required Qualifications *
                </label>
                <textarea
                  name="qualifications"
                  value={formData.qualifications}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="List required qualifications, education, certifications..."
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.qualifications ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.qualifications && (
                  <p className="text-red-500 text-sm mt-1">{errors.qualifications}</p>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <Button
              text="Cancel"
              className="btn-light"
              type="button"
              onClick={handleCancel}
              disabled={loading}
            />
            <Button
              text={loading ? "Saving..." : (isEditMode ? "Update Job" : "Create Job")}
              className="btn-primary"
              type="submit"
              disabled={loading}
            />
          </div>
        </form>
      </Card>
    </div>
  );
};

export default JobForm;

