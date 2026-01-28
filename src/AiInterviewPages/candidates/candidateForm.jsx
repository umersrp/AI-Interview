import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import CustomSelect from "@/components/ui/Select";
import InputGroup from "@/components/ui/InputGroup";

const CandidateForm = () => {
    const navigate = useNavigate();
  
  // ---------- OPTIONS ----------
  const jobRoles = ["Frontend Developer", "Backend Developer", "AI Engineer"];
  const interviewStatuses = ["Pending", "Passed", "Rejected"];
  const recommendations = ["Hire", "Review", "Reject"];

  const jobRoleOptions = jobRoles.map(j => ({ label: j, value: j }));
  const interviewStatusOptions = interviewStatuses.map(s => ({
    label: s,
    value: s,
  }));
  const recommendationOptions = recommendations.map(r => ({
    label: r,
    value: r,
  }));

  // ---------- STATE ----------
  const [formData, setFormData] = useState({
    candidateName: "",
    email: "",
    appliedJob: null,
    experience: "",
    interviewStatus: { label: "Pending", value: "Pending" },
    aiScore: "",
    cvMatchPercent: "",
    recommendation: { label: "Review", value: "Review" },
  });

  const [errors, setErrors] = useState({});

  // ---------- HANDLERS ----------
  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (value, { name }) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.candidateName) newErrors.candidateName = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.appliedJob) newErrors.appliedJob = "Job role is required";
    return newErrors;
  };

  const handleSubmit = e => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      ...formData,
      appliedJob: formData.appliedJob?.value,
      interviewStatus: formData.interviewStatus?.value,
      recommendation: formData.recommendation?.value,
      aiScore: Number(formData.aiScore),
      cvMatchPercent: Number(formData.cvMatchPercent),
    };

    console.log("Candidate Data:", payload);
  };

  // ---------- UI ----------
  return (
    <Card title="Add Candidate">
      <form onSubmit={handleSubmit} className="space-y-8">

        {/* ===== Basic Info ===== */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            Candidate Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputGroup
              label="Candidate Name *"
              name="candidateName"
              value={formData.candidateName}
              onChange={handleInputChange}
              error={errors.candidateName}
              placeholder="Enter full name"
            />

            <InputGroup
              label="Email Address *"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              placeholder="example@email.com"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Applied Job *
              </label>
              <CustomSelect
                label=""
                name="appliedJob"
                value={formData.appliedJob}
                options={jobRoleOptions}
                onChange={handleSelectChange}
                error={errors.appliedJob}
                placeholder="Select job role"
              />
            </div>
            <InputGroup
              label="Experience (Years)"
              name="experience"
              type="number"
              value={formData.experience}
              onChange={handleInputChange}
              placeholder="e.g. 2"
            />
          </div>
        </div>

        {/* ===== Evaluation ===== */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            Interview Evaluation
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Interview Status
              </label>
              <CustomSelect
                label="Interview Status"
                name="interviewStatus"
                value={formData.interviewStatus}
                options={interviewStatusOptions}
                onChange={handleSelectChange}
              />
            </div>

            <InputGroup
              label="AI Score"
              name="aiScore"
              type="number"
              value={formData.aiScore}
              onChange={handleInputChange}
              placeholder="0 – 100"
            />

            <InputGroup
              label="CV Match %"
              name="cvMatchPercent"
              type="number"
              value={formData.cvMatchPercent}
              onChange={handleInputChange}
              placeholder="0 – 100"
            />
          </div>
        </div>

        {/* ===== Final Decision ===== */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            Final Recommendation
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Recommendation
            </label>
            <CustomSelect
              label=""
              name="recommendation"
              value={formData.recommendation}
              options={recommendationOptions}
              onChange={handleSelectChange}
            />
          </div>
        </div>

        {/* ===== Actions ===== */}
        <div className="flex justify-end pt-6 border-t">
          <Button type="submit" text="Save Candidate" 
           onClick={() => navigate("/candidates")}/>
        </div>
      </form>
    </Card>
  );
};

export default CandidateForm;
