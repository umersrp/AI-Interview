// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import Card from "@/components/ui/Card";
// import Input from "@/components/ui/Input";
// import Button from "@/components/ui/Button";
// import InputGroup from "@/components/ui/InputGroup";
// import Modal from "@/components/ui/Modal";
// import axios from "axios";
// import { toast } from "react-toastify";

// const CandidateForm = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   // Get jobId and companyId from URL query parameters
//   const queryParams = new URLSearchParams(location.search);
//   let jobIdFromUrl = queryParams.get('jobId');
//   let companyIdFromUrl = queryParams.get('companyId');

//   // Development mode - use test IDs if not provided
//   const isDevelopment = process.env.NODE_ENV === 'development';
//   const TEST_COMPANY_ID = "698dd909920029dbcad38e72";
//   const TEST_JOB_ID = "698f2fcfa362b441ad4cee6b";

//   if (isDevelopment && (!jobIdFromUrl || !companyIdFromUrl)) {
//     console.log("Development mode: Using test IDs");
//     jobIdFromUrl = TEST_JOB_ID;
//     companyIdFromUrl = TEST_COMPANY_ID;
//   }

//   const [jobDetails, setJobDetails] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [fetchingData, setFetchingData] = useState(true);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
  
//   const [formData, setFormData] = useState({
//     candidateName: "",
//     email: "",
//     appliedJob: jobIdFromUrl || "",
//     companyId: companyIdFromUrl || "",
//     experience: "",
//     uploadedCV: ""
//   });

//   const [errors, setErrors] = useState({});
//   const [cvFile, setCvFile] = useState(null);
//   const [cvFileName, setCvFileName] = useState("");

//   // Fetch job details to display
//   useEffect(() => {
//     const fetchJobDetails = async () => {
//       if (!jobIdFromUrl || !companyIdFromUrl) {
//         toast.error("Missing job or company information");
//         // In production, redirect to home, in development show error but continue
//         if (!isDevelopment) {
//           navigate("/");
//         }
//         return;
//       }

//       try {
//         setFetchingData(true);
//         const token = localStorage.getItem("token");
        
//         // Fetch job details
//         const jobResponse = await axios.get(
//           `${import.meta.env.VITE_APP_BASE_URL}/jobs/${jobIdFromUrl}`,
//           { headers: { Authorization: `${token}` } }
//         );

//         const jobData = jobResponse.data?.data || jobResponse.data;
//         setJobDetails(jobData);
        
//         setFormData(prev => ({
//           ...prev,
//           appliedJob: jobIdFromUrl,
//           companyId: companyIdFromUrl
//         }));
        
//       } catch (error) {
//         console.error("Error fetching details:", error);
//         toast.error("Failed to load job details");
//         if (!isDevelopment) {
//           navigate("/");
//         }
//       } finally {
//         setFetchingData(false);
//       }
//     };

//     fetchJobDetails();
//   }, [jobIdFromUrl, companyIdFromUrl, navigate, isDevelopment]);

//   // Handle input changes
//   const handleInputChange = e => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     setErrors(prev => ({ ...prev, [name]: "" }));
//   };

//   // Handle file change
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       // Check file type
//       const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
//       if (!allowedTypes.includes(file.type)) {
//         toast.error("Please upload only PDF or Word documents");
//         e.target.value = null;
//         return;
//       }
      
//       // Check file size (max 5MB)
//       if (file.size > 5 * 1024 * 1024) {
//         toast.error("File size should be less than 5MB");
//         e.target.value = null;
//         return;
//       }
      
//       setCvFile(file);
//       setCvFileName(file.name);
//       setErrors(prev => ({ ...prev, uploadedCV: "" }));
//     }
//   };

//   // Upload CV
//   const uploadCV = async () => {
//     if (!cvFile) return "";
    
//     try {
//       setUploading(true);
//       const token = localStorage.getItem("token");
      
//       const formData = new FormData();
//       formData.append("documentFile", cvFile);
      
//       const response = await axios.post(
//         `${import.meta.env.VITE_APP_BASE_URL}/upload/upload`,
//         formData,
//         {
//           headers: { 
//             Authorization: `${token}`,
//             "Content-Type": "multipart/form-data"
//           }
//         }
//       );
      
//       // Get URL from response.data.data
//       const fileUrl = response.data?.data || "";
//       return fileUrl;
//     } catch (error) {
//       console.error("Error uploading CV:", error);
//       toast.error(error.response?.data?.message || "Failed to upload CV");
//       throw error;
//     } finally {
//       setUploading(false);
//     }
//   };

//   // Validate form
//   const validate = () => {
//     const newErrors = {};
//     if (!formData.candidateName?.trim()) newErrors.candidateName = "Name is required";
//     if (!formData.email?.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = "Email is invalid";
//     }
//     if (!cvFile && !formData.uploadedCV) {
//       newErrors.uploadedCV = "CV is required";
//     }
//     return newErrors;
//   };

//   // Handle form submission
//   const handleSubmit = async e => {
//     e.preventDefault();
    
//     const validationErrors = validate();
//     if (Object.keys(validationErrors).length) {
//       setErrors(validationErrors);
//       return;
//     }

//     try {
//       setLoading(true);
      
//       // Upload CV first
//       let cvUrl = "";
//       if (cvFile) {
//         cvUrl = await uploadCV();
//       }

//       const payload = {
//         candidateName: formData.candidateName,
//         email: formData.email,
//         appliedJob: formData.appliedJob,
//         companyId: formData.companyId,
//         experience: formData.experience || "0",
//         uploadedCV: cvUrl || ""
//       };

//       console.log("Submitting application:", payload);

//       const token = localStorage.getItem("token");
      
//       await axios.post(
//         `${import.meta.env.VITE_APP_BASE_URL}/candidates`,
//         payload,
//         {
//           headers: { Authorization: `${token}` }
//         }
//       );
      
//       // Show success popup - DON'T clear token or redirect to login
//       setShowSuccessModal(true);
      
//     } catch (error) {
//       console.error("Error submitting application:", error);
//       toast.error(error.response?.data?.message || "Failed to submit application");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle success modal close - just close the modal, stay on the page
//   const handleSuccessModalClose = () => {
//     setShowSuccessModal(false);
//     // Optionally reset form for another submission
//     setFormData({
//       candidateName: "",
//       email: "",
//       appliedJob: jobIdFromUrl || "",
//       companyId: companyIdFromUrl || "",
//       experience: "",
//       uploadedCV: ""
//     });
//     setCvFile(null);
//     setCvFileName("");
//   };

//   // Show loading state while fetching details
//   if (fetchingData) {
//     return (
//       <Card title="Job Application">
//         <div className="text-center py-12">
//           <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading application details...</p>
//         </div>
//       </Card>
//     );
//   }

//   // Show error if no job found
//   if (!jobDetails) {
//     return (
//       <Card title="Job Application">
//         <div className="text-center py-12">
//           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
//             </svg>
//           </div>
//           <h3 className="text-lg font-medium text-gray-900 mb-2">Job Not Found</h3>
//           <p className="text-gray-600">The job you're applying for doesn't exist or has been removed.</p>
//           <Button
//             text="Go Back"
//             className="btn-primary mt-4"
//             onClick={() => navigate("/")}
//           />
//         </div>
//       </Card>
//     );
//   }

//   return (
//     <div className="p-20">
//       <Card title="Apply for Job">
//         {/* Development Mode Banner */}
//         {isDevelopment && (!queryParams.get('jobId') || !queryParams.get('companyId')) && (
//           <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
//             <p className="font-bold">Development Mode</p>
//             <p>Using test IDs. In production, these should come from URL parameters.</p>
//           </div>
//         )}

//         {/* Job Information Banner */}
//         <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg mb-6">
//           <h3 className="text-lg font-semibold text-gray-800 mb-2">Applying for:</h3>
//           <div className="flex items-start space-x-4">
//             <div className="flex-1">
//               <p className="text-xl font-bold text-gray-900">{jobDetails.jobTitle}</p>
//               <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
//                 <div>
//                   <span className="text-gray-600">Department:</span>
//                   <span className="ml-2 font-medium">{jobDetails.department || "Not specified"}</span>
//                 </div>
//                 <div>
//                   <span className="text-gray-600">Location:</span>
//                   <span className="ml-2 font-medium">{jobDetails.location || "Remote"}</span>
//                 </div>
//               </div>
//               {jobDetails.requiredSkills && jobDetails.requiredSkills.length > 0 && (
//                 <div className="mt-3">
//                   <p className="text-sm text-gray-600 mb-1">Required Skills:</p>
//                   <div className="flex flex-wrap gap-1">
//                     {jobDetails.requiredSkills.slice(0, 5).map((skill, index) => (
//                       <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
//                         {skill}
//                       </span>
//                     ))}
//                     {jobDetails.requiredSkills.length > 5 && (
//                       <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
//                         +{jobDetails.requiredSkills.length - 5} more
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-8">
//           {(loading || uploading) && (
//             <div className="text-center py-4">
//               <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
//               <p className="mt-2 text-sm text-gray-600">
//                 {uploading ? "Uploading CV..." : "Submitting application..."}
//               </p>
//             </div>
//           )}

//           {/* Candidate Information */}
//           <div>
//             <h3 className="text-sm font-semibold text-gray-700 mb-4">
//               Your Information
//             </h3>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//               <InputGroup
//                 label="Full Name *"
//                 name="candidateName"
//                 value={formData.candidateName}
//                 onChange={handleInputChange}
//                 error={errors.candidateName}
//                 placeholder="Enter your full name"
//                 disabled={loading || uploading}
//               />

//               <InputGroup
//                 label="Email Address *"
//                 name="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 error={errors.email}
//                 placeholder="your@email.com"
//                 disabled={loading || uploading}
//               />

//               <InputGroup
//                 label="Experience (Years)"
//                 name="experience"
//                 type="number"
//                 min="0"
//                 step="0.5"
//                 value={formData.experience}
//                 onChange={handleInputChange}
//                 placeholder="e.g. 2"
//                 disabled={loading || uploading}
//               />
//             </div>
//           </div>

//           {/* CV Upload */}
//           <div>
//             <h3 className="text-sm font-semibold text-gray-700 mb-4">
//               Upload Your CV
//             </h3>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   CV File *
//                 </label>
//                 <div className="flex items-center space-x-4">
//                   <label className="cursor-pointer">
//                     <input
//                       type="file"
//                       className="hidden"
//                       accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
//                       onChange={handleFileChange}
//                       disabled={loading || uploading}
//                     />
//                     <span className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block">
//                       Choose File
//                     </span>
//                   </label>
//                   {cvFileName && (
//                     <span className="text-sm text-gray-600">
//                       Selected: {cvFileName}
//                     </span>
//                   )}
//                 </div>
//                 {errors.uploadedCV && (
//                   <p className="mt-1 text-sm text-red-600">{errors.uploadedCV}</p>
//                 )}
//                 <p className="mt-2 text-xs text-gray-500">
//                   Accepted formats: PDF, DOC, DOCX (Max size: 5MB)
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Hidden fields for IDs */}
//           <input type="hidden" name="appliedJob" value={formData.appliedJob} />
//           <input type="hidden" name="companyId" value={formData.companyId} />

      
//           {/* Actions */}
//           <div className="flex justify-end space-x-3 pt-6 border-t">
//             <Button
//               type="button"
//               text="Cancel"
//               className="btn-light"
//               onClick={() => navigate("/")}
//               disabled={loading || uploading}
//             />
//             <Button
//               type="submit"
//               text="Submit Application"
//               className="btn-primary"
//               disabled={loading || uploading}
//             />
//           </div>
//         </form>
//       </Card>

//       {/* Success Modal - Without redirect to login */}
//       <Modal
//         activeModal={showSuccessModal}
//         onClose={handleSuccessModalClose}
//         title="Application Submitted!"
//         themeClass="bg-gradient-to-r from-green-500 to-emerald-500"
//         centered
//         footerContent={
//           <div className="flex justify-center w-full">
//             <Button
//               text="Apply for Another Job"
//               className="btn-light"
//               onClick={handleSuccessModalClose}
//             />
//           </div>
//         }
//       >
//         <div className="text-center py-4">
//           <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
//             </svg>
//           </div>
//           <h3 className="text-lg font-medium text-gray-900 mb-2">
//             Thank You for Applying!
//           </h3>
//           <p className="text-gray-600 mb-2">
//             Your application for <span className="font-semibold">{jobDetails?.jobTitle}</span> has been submitted successfully.
//           </p>
//           <p className="text-gray-600">
//             You can now apply for another position.
//           </p>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default CandidateForm;

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import InputGroup from "@/components/ui/InputGroup";
import Modal from "@/components/ui/Modal";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "@/assets/images/logo/logo3.png";

const CandidateForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get jobId and companyId from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  let jobIdFromUrl = queryParams.get('jobId');
  let companyIdFromUrl = queryParams.get('companyId');

  // Development mode - use test IDs if not provided
  const isDevelopment = process.env.NODE_ENV === 'development';
  const TEST_COMPANY_ID = "698dd909920029dbcad38e72";
  const TEST_JOB_ID = "698f2fcfa362b441ad4cee6b";

  if (isDevelopment && (!jobIdFromUrl || !companyIdFromUrl)) {
    console.log("Development mode: Using test IDs");
    jobIdFromUrl = TEST_JOB_ID;
    companyIdFromUrl = TEST_COMPANY_ID;
  }

  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [cvUploadedUrl, setCvUploadedUrl] = useState("");
  
  const [formData, setFormData] = useState({
    candidateName: "",
    email: "",
    appliedJob: jobIdFromUrl || "",
    companyId: companyIdFromUrl || "",
    experience: "",
    uploadedCV: ""
  });

  const [errors, setErrors] = useState({});
  const [cvFile, setCvFile] = useState(null);
  const [cvFileName, setCvFileName] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  // Fetch job details to display
  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobIdFromUrl || !companyIdFromUrl) {
        toast.error("Missing job or company information");
        // In production, redirect to home, in development show error but continue
        if (!isDevelopment) {
          navigate("/");
        }
        return;
      }

      try {
        setFetchingData(true);
        const token = localStorage.getItem("token");
        
        // Fetch job details
        const jobResponse = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/jobs/${jobIdFromUrl}`,
          { headers: { Authorization: `${token}` } }
        );

        const jobData = jobResponse.data?.data || jobResponse.data;
        setJobDetails(jobData);
        
        setFormData(prev => ({
          ...prev,
          appliedJob: jobIdFromUrl,
          companyId: companyIdFromUrl
        }));
        
      } catch (error) {
        console.error("Error fetching details:", error);
        toast.error("Failed to load job details");
        if (!isDevelopment) {
          navigate("/");
        }
      } finally {
        setFetchingData(false);
      }
    };

    fetchJobDetails();
  }, [jobIdFromUrl, companyIdFromUrl, navigate, isDevelopment]);

  // Handle input changes
  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  // Handle file change and auto-upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload only PDF or Word documents");
        e.target.value = null;
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        e.target.value = null;
        return;
      }
      
      setCvFile(file);
      setCvFileName(file.name);
      setErrors(prev => ({ ...prev, uploadedCV: "" }));
      
      // Auto-upload the file immediately
      await uploadCV(file);
    }
  };

  // Upload CV immediately when file is selected
  const uploadCV = async (file) => {
    if (!file) return;
    
    try {
      setUploading(true);
      setUploadProgress(0);
      const token = localStorage.getItem("token");
      
      const formData = new FormData();
      formData.append("documentFile", file);
      
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/upload/upload`,
        formData,
        {
          headers: { 
            Authorization: `${token}`,
            "Content-Type": "multipart/form-data"
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        }
      );
      
      // Get URL from response.data.data
      const fileUrl = response.data?.data || "";
      setCvUploadedUrl(fileUrl);
      
      // Update form data with uploaded CV URL
      setFormData(prev => ({
        ...prev,
        uploadedCV: fileUrl
      }));
      
      toast.success("CV uploaded successfully!");
      
    } catch (error) {
      console.error("Error uploading CV:", error);
      toast.error(error.response?.data?.message || "Failed to upload CV");
      setCvFile(null);
      setCvFileName("");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Validate form
  const validate = () => {
    const newErrors = {};
    if (!formData.candidateName?.trim()) newErrors.candidateName = "Name is required";
    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.uploadedCV && !cvUploadedUrl) {
      newErrors.uploadedCV = "CV is required";
    }
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async e => {
    e.preventDefault();
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      const payload = {
        candidateName: formData.candidateName,
        email: formData.email,
        appliedJob: formData.appliedJob,
        companyId: formData.companyId,
        experience: formData.experience || "0",
        uploadedCV: formData.uploadedCV || cvUploadedUrl || ""
      };

      console.log("Submitting application:", payload);

      const token = localStorage.getItem("token");
      
      await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/candidates`,
        payload,
        {
          headers: { Authorization: `${token}` }
        }
      );
      
      // Show success popup
      setShowSuccessModal(true);
      
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error(error.response?.data?.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  // Handle success modal close - just close the modal, stay on the page
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    // Reset form for another submission
    setFormData({
      candidateName: "",
      email: "",
      appliedJob: jobIdFromUrl || "",
      companyId: companyIdFromUrl || "",
      experience: "",
      uploadedCV: ""
    });
    setCvFile(null);
    setCvFileName("");
    setCvUploadedUrl("");
  };

  // Show loading state while fetching details
  if (fetchingData) {
    return (
      <div className="p-20">
      <Card title="Job Application">
        <div className="flex justify-center items-center py-12">
          <img src={Loader} alt="Loading..." className="w-60 h-16" />
        </div>
      </Card>
      </div>
    );
  }

  // Show error if no job found
  if (!jobDetails) {
    return (
      <Card title="Job Application">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Job Not Found</h3>
          <p className="text-gray-600">The job you're applying for doesn't exist or has been removed.</p>
          <Button
            text="Go Back"
            className="btn-primary mt-4"
            onClick={() => navigate("/")}
          />
        </div>
      </Card>
    );
  }

  return (
    <div className="p-20">
      <Card title="Apply for Job">
        {/* Development Mode Banner */}
        {isDevelopment && (!queryParams.get('jobId') || !queryParams.get('companyId')) && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
            <p className="font-bold">Development Mode</p>
            <p>Using test IDs. In production, these should come from URL parameters.</p>
          </div>
        )}

        {/* Job Information Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Applying for:</h3>
          <div className="flex items-start space-x-4">
            <div className="flex-1">
              <p className="text-xl font-bold text-gray-900">{jobDetails.jobTitle}</p>
              <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                <div>
                  <span className="text-gray-600">Department:</span>
                  <span className="ml-2 font-medium">{jobDetails.department || "Not specified"}</span>
                </div>
                <div>
                  <span className="text-gray-600">Location:</span>
                  <span className="ml-2 font-medium">{jobDetails.location || "Remote"}</span>
                </div>
              </div>
              {jobDetails.requiredSkills && jobDetails.requiredSkills.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-1">Required Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {jobDetails.requiredSkills.slice(0, 5).map((skill, index) => (
                      <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {skill}
                      </span>
                    ))}
                    {jobDetails.requiredSkills.length > 5 && (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                        +{jobDetails.requiredSkills.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {loading && (
            <div className="text-center py-4">
              <img src={Loader} alt="Loading..." className="w-40 h-12 mx-auto" />
              <p className="mt-2 text-sm text-gray-600">Submitting application...</p>
            </div>
          )}

          {/* Candidate Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              Your Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputGroup
                label="Full Name *"
                name="candidateName"
                value={formData.candidateName}
                onChange={handleInputChange}
                error={errors.candidateName}
                placeholder="Enter your full name"
                disabled={loading}
              />

              <InputGroup
                label="Email Address *"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                placeholder="your@email.com"
                disabled={loading}
              />

              <InputGroup
                label="Experience (Years)"
                name="experience"
                type="number"
                min="0"
                step="0.5"
                value={formData.experience}
                onChange={handleInputChange}
                placeholder="e.g. 2"
                disabled={loading}
              />
            </div>
          </div>

          {/* CV Upload */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              Upload Your CV
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CV File *
                </label>
                <div className="flex items-center space-x-4">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleFileChange}
                      disabled={loading || uploading}
                    />
                    <span className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block">
                      Choose File
                    </span>
                  </label>
                  {cvFileName && (
                    <span className="text-sm text-gray-600">
                      Selected: {cvFileName}
                    </span>
                  )}
                  {formData.uploadedCV && !uploading && (
                    <span className="text-xs text-green-600">✓ Uploaded</span>
                  )}
                </div>
                
                {/* Upload Progress */}
                {uploading && (
                  <div className="mt-3">
                    <div className="flex items-center space-x-3">
                      <img src={Loader} alt="Uploading..." className="w-20 h-6" />
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Uploading: {uploadProgress}%</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {errors.uploadedCV && (
                  <p className="mt-1 text-sm text-red-600">{errors.uploadedCV}</p>
                )}
                <p className="mt-2 text-xs text-gray-500">
                  Accepted formats: PDF, DOC, DOCX (Max size: 5MB)
                </p>
              </div>
            </div>
          </div>

          {/* Hidden fields for IDs */}
          <input type="hidden" name="appliedJob" value={formData.appliedJob} />
          <input type="hidden" name="companyId" value={formData.companyId} />

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button
              type="button"
              text="Cancel"
              className="btn-light"
              onClick={() => navigate("/")}
              disabled={loading}
            />
            <Button
              type="submit"
              text="Submit Application"
              className="btn-primary"
              disabled={loading || uploading || !formData.uploadedCV}
            />
          </div>
        </form>
      </Card>

      {/* Success Modal */}
      <Modal
        activeModal={showSuccessModal}
        onClose={handleSuccessModalClose}
        title="Application Submitted!"
        themeClass="bg-gradient-to-r from-green-500 to-emerald-500"
        centered
        footerContent={
          <div className="flex justify-center w-full">
            <Button
              text="Apply for Another Job"
              className="btn-light"
              onClick={handleSuccessModalClose}
            />
          </div>
        }
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Thank You for Applying!
          </h3>
          <p className="text-gray-600 mb-2">
            Your application for <span className="font-semibold">{jobDetails?.jobTitle}</span> has been submitted successfully.
          </p>
          <p className="text-gray-600">
            You can now apply for another position.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default CandidateForm;

