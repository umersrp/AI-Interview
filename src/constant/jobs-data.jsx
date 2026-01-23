// src/data/jobsData.js

// export const jobsData = [
//   {
//     id: 1,
//     jobTitle: "Senior Software Engineer",
//     department: "Engineering",
//     requiredSkills: ["React", "TypeScript", "Node.js", "AWS", "Microservices"],
//     experience: "Mid-Senior Level",
//     interviewType: "Voice",
//     aiWeightage: {
//       skills: 40,
//       communication: 30,
//       experience: 30
//     },
//     status: "Active",
//     candidates: 24,
//     postedDate: "2024-01-15",
//     deadline: "2024-03-15",
//     location: "San Francisco, CA",
//     salary: "$140,000 - $180,000",
//     remote: true,
//     description: "Looking for a Senior Software Engineer to lead development of our core platform. Must have experience with modern JavaScript frameworks and cloud infrastructure."
//   },
//   {
//     id: 2,
//     jobTitle: "Product Manager",
//     department: "Product",
//     requiredSkills: ["Product Strategy", "Agile", "Market Research", "UX/UI", "Roadmapping"],
//     experience: "Mid-Senior Level",
//     interviewType: "Text",
//     aiWeightage: {
//       skills: 35,
//       communication: 40,
//       experience: 25
//     },
//     status: "Active",
//     candidates: 18,
//     postedDate: "2024-01-20",
//     deadline: "2024-03-20",
//     location: "New York, NY",
//     salary: "$130,000 - $160,000",
//     remote: true,
//     description: "Lead product strategy and execution for our flagship product. Experience with SaaS products and user research required."
//   },
//   {
//     id: 3,
//     jobTitle: "HR Specialist",
//     department: "Human Resources",
//     requiredSkills: ["Recruitment", "Onboarding", "Employee Relations", "HRIS Compliance"],
//     experience: "Associate",
//     interviewType: "Text",
//     aiWeightage: {
//       skills: 30,
//       communication: 50,
//       experience: 20
//     },
//     status: "Active",
//     candidates: 32,
//     postedDate: "2024-02-01",
//     deadline: "2024-04-01",
//     location: "Chicago, IL",
//     salary: "$65,000 - $85,000",
//     remote: false,
//     description: "Support HR operations including recruitment, onboarding, and employee relations. HR certification preferred."
//   },
//   {
//     id: 4,
//     jobTitle: "Data Scientist",
//     department: "Data & Analytics",
//     requiredSkills: ["Python", "R", "SQL", "Machine Learning", "Statistical Analysis"],
//     experience: "Senior Level",
//     interviewType: "Voice",
//     aiWeightage: {
//       skills: 50,
//       communication: 20,
//       experience: 30
//     },
//     status: "Closed",
//     candidates: 45,
//     postedDate: "2023-12-10",
//     deadline: "2024-02-10",
//     location: "Remote",
//     salary: "$150,000 - $200,000",
//     remote: true,
//     description: "Advanced analytics role focusing on predictive modeling and machine learning applications for business intelligence."
//   },
//   {
//     id: 5,
//     jobTitle: "Marketing Coordinator",
//     department: "Marketing",
//     requiredSkills: ["Content Creation", "Social Media", "Email Marketing", "SEO Basics", "Analytics"],
//     experience: "Entry Level",
//     interviewType: "Text",
//     aiWeightage: {
//       skills: 25,
//       communication: 45,
//       experience: 30
//     },
//     status: "Active",
//     candidates: 28,
//     postedDate: "2024-02-05",
//     deadline: "2024-04-05",
//     location: "Austin, TX",
//     salary: "$55,000 - $70,000",
//     remote: true,
//     description: "Support marketing campaigns across digital channels. Great opportunity for recent graduates interested in marketing tech."
//   },
//   {
//     id: 6,
//     jobTitle: "UX/UI Designer",
//     department: "Design",
//     requiredSkills: ["Figma", "User Research", "Prototyping", "Design Systems", "Accessibility"],
//     experience: "Mid-Senior Level",
//     interviewType: "Video",
//     aiWeightage: {
//       skills: 45,
//       communication: 35,
//       experience: 20
//     },
//     status: "Active",
//     candidates: 22,
//     postedDate: "2024-02-10",
//     deadline: "2024-04-10",
//     location: "Seattle, WA",
//     salary: "$110,000 - $140,000",
//     remote: true,
//     description: "Design intuitive user interfaces for our enterprise software. Must have portfolio showcasing complex web applications."
//   },
//   {
//     id: 7,
//     jobTitle: "DevOps Engineer",
//     department: "Engineering",
//     requiredSkills: ["Kubernetes", "Docker", "AWS/GCP", "CI/CD", "Terraform"],
//     experience: "Senior Level",
//     interviewType: "Voice",
//     aiWeightage: {
//       skills: 55,
//       communication: 25,
//       experience: 20
//     },
//     status: "Active",
//     candidates: 19,
//     postedDate: "2024-01-25",
//     deadline: "2024-03-25",
//     location: "Remote",
//     salary: "$130,000 - $170,000",
//     remote: true,
//     description: "Build and maintain our cloud infrastructure and deployment pipelines. Strong background in containerization required."
//   },
//   {
//     id: 8,
//     jobTitle: "Sales Executive",
//     department: "Sales",
//     requiredSkills: ["B2B Sales", "CRM", "Negotiation", "Lead Generation", "Client Management"],
//     experience: "Mid-Senior Level",
//     interviewType: "Hybrid",
//     aiWeightage: {
//       skills: 30,
//       communication: 50,
//       experience: 20
//     },
//     status: "Active",
//     candidates: 15,
//     postedDate: "2024-02-15",
//     deadline: "2024-04-15",
//     location: "Boston, MA",
//     salary: "$90,000 + Commission",
//     remote: false,
//     description: "Drive enterprise sales for our SaaS platform. Experience selling to tech companies preferred."
//   },
//   {
//     id: 9,
//     jobTitle: "QA Automation Engineer",
//     department: "Engineering",
//     requiredSkills: ["Selenium", "Cypress", "Python", "Test Automation", "API Testing"],
//     experience: "Associate",
//     interviewType: "Text",
//     aiWeightage: {
//       skills: 40,
//       communication: 30,
//       experience: 30
//     },
//     status: "Active",
//     candidates: 21,
//     postedDate: "2024-02-08",
//     deadline: "2024-04-08",
//     location: "Denver, CO",
//     salary: "$85,000 - $110,000",
//     remote: true,
//     description: "Build and maintain automated test suites for our web applications. Experience with modern testing frameworks required."
//   },
//   {
//     id: 10,
//     jobTitle: "Finance Analyst",
//     department: "Finance",
//     requiredSkills: ["Financial Modeling", "Excel", "Budgeting", "Forecasting", "Data Analysis"],
//     experience: "Associate",
//     interviewType: "Text",
//     aiWeightage: {
//       skills: 35,
//       communication: 40,
//       experience: 25
//     },
//     status: "Closed",
//     candidates: 38,
//     postedDate: "2023-12-20",
//     deadline: "2024-02-20",
//     location: "Remote",
//     salary: "$75,000 - $95,000",
//     remote: true,
//     description: "Support financial planning and analysis for our growing company. CPA or CFA candidates preferred."
//   },
//   {
//     id: 11,
//     jobTitle: "Backend Developer",
//     department: "Engineering",
//     requiredSkills: ["Java", "Spring Boot", "Microservices", "PostgreSQL", "Redis"],
//     experience: "Mid-Senior Level",
//     interviewType: "Voice",
//     aiWeightage: {
//       skills: 50,
//       communication: 25,
//       experience: 25
//     },
//     status: "Active",
//     candidates: 27,
//     postedDate: "2024-02-12",
//     deadline: "2024-04-12",
//     location: "Remote",
//     salary: "$120,000 - $160,000",
//     remote: true,
//     description: "Develop and maintain our backend services using Java and Spring ecosystem. Experience with distributed systems required."
//   },
//   {
//     id: 12,
//     jobTitle: "Customer Success Manager",
//     department: "Customer Success",
//     requiredSkills: ["Account Management", "CRM", "Client Onboarding", "Support", "Retention"],
//     experience: "Mid-Senior Level",
//     interviewType: "Hybrid",
//     aiWeightage: {
//       skills: 25,
//       communication: 55,
//       experience: 20
//     },
//     status: "Active",
//     candidates: 16,
//     postedDate: "2024-02-18",
//     deadline: "2024-04-18",
//     location: "Remote",
//     salary: "$95,000 - $120,000",
//     remote: true,
//     description: "Ensure customer satisfaction and retention for our enterprise clients. Experience with SaaS customer success required."
//   }
// ];
// src/constant/jobs-data.js
const jobsData = [
  {
    id: 1,
    jobTitle: "Senior Software Engineer",
    department: "Engineering",
    requiredSkills: ["React", "TypeScript", "Node.js", "AWS", "Microservices"],
    experience: "Mid-Senior Level",
    interviewType: "Voice",
    aiWeightage: {
      skills: 40,
      communication: 30,
      experience: 30
    },
    status: "Active",
    candidates: 24,
  },
  {
    id: 2,
    jobTitle: "Product Manager",
    department: "Product",
    requiredSkills: ["Product Strategy", "Agile", "Market Research", "UX/UI", "Roadmapping"],
    experience: "Mid-Senior Level",
    interviewType: "Text",
    aiWeightage: {
      skills: 35,
      communication: 40,
      experience: 25
    },
    status: "Active",
    candidates: 18,
  },
  {
    id: 3,
    jobTitle: "HR Specialist",
    department: "Human Resources",
    requiredSkills: ["Recruitment", "Onboarding", "Employee Relations", "HRIS Compliance"],
    experience: "Associate",
    interviewType: "Text",
    aiWeightage: {
      skills: 30,
      communication: 50,
      experience: 20
    },
    status: "Active",
    candidates: 32,
  },
  {
    id: 4,
    jobTitle: "Data Scientist",
    department: "Data & Analytics",
    requiredSkills: ["Python", "R", "SQL", "Machine Learning", "Statistical Analysis"],
    experience: "Senior Level",
    interviewType: "Voice",
    aiWeightage: {
      skills: 50,
      communication: 20,
      experience: 30
    },
    status: "Closed",
    candidates: 45,
  },
  {
    id: 5,
    jobTitle: "Marketing Coordinator",
    department: "Marketing",
    requiredSkills: ["Content Creation", "Social Media", "Email Marketing", "SEO Basics", "Analytics"],
    experience: "Entry Level",
    interviewType: "Text",
    aiWeightage: {
      skills: 25,
      communication: 45,
      experience: 30
    },
    status: "Active",
    candidates: 28,
  }
];



export const departments = [
  "Engineering",
  "Product", 
  "Human Resources",
  "Data & Analytics",
  "Marketing",
  "Sales",
  "Design",
  "Finance",
  "Customer Success",
  "Operations",
  "Legal",
  "Support"
];

export const experienceLevels = [
  "Intern",
  "Entry Level",
  "Associate",
  "Mid-Senior Level", 
  "Senior Level",
  "Lead",
  "Principal",
  "Director",
  "VP",
  "Executive"
];

export const interviewTypes = [
  "Voice",
  "Text",
  "Video",
  "Hybrid"
];

export const locations = [
  "Remote",
  "San Francisco, CA",
  "New York, NY",
  "Chicago, IL",
  "Austin, TX",
  "Seattle, WA",
  "Boston, MA",
  "Denver, CO",
  "Los Angeles, CA",
  "Miami, FL",
  "Atlanta, GA",
  "Portland, OR"
];

export const statusOptions = [
  "Draft",
  "Active",
  "On Hold",
  "Closed",
  "Archived"
];

export const skillsList = [
  "React", "TypeScript", "JavaScript", "Node.js", "Python", "Java", "Go",
  "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform",
  "PostgreSQL", "MongoDB", "MySQL", "Redis", "Elasticsearch",
  "Machine Learning", "Data Science", "AI/ML", "Statistical Analysis",
  "Product Management", "Agile", "Scrum", "Jira", "Roadmapping",
  "UX Design", "UI Design", "Figma", "Sketch", "Adobe Creative Suite",
  "Sales", "Marketing", "SEO", "Content Creation", "Social Media",
  "Finance", "Accounting", "Financial Modeling", "Excel",
  "Communication", "Leadership", "Project Management", "Team Management",
  "DevOps", "CI/CD", "Automation", "Testing", "QA",
  "HR", "Recruitment", "Talent Acquisition", "Employee Relations"
];

export const getJobStats = () => {
  const totalJobs = jobsData.length;
  const activeJobs = jobsData.filter(job => job.status === "Active").length;
  const totalCandidates = jobsData.reduce((sum, job) => sum + job.candidates, 0);
  const avgCandidates = Math.round(totalCandidates / totalJobs);
  
  return {
    totalJobs,
    activeJobs,
    closedJobs: totalJobs - activeJobs,
    totalCandidates,
    avgCandidates
  };
};

export const getJobsByDepartment = () => {
  const departmentCounts = {};
  
  jobsData.forEach(job => {
    if (!departmentCounts[job.department]) {
      departmentCounts[job.department] = 0;
    }
    departmentCounts[job.department]++;
  });
  
  return departmentCounts;
};

export const getTopSkills = (limit = 10) => {
  const skillCounts = {};
  
  jobsData.forEach(job => {
    job.requiredSkills.forEach(skill => {
      if (!skillCounts[skill]) {
        skillCounts[skill] = 0;
      }
      skillCounts[skill]++;
    });
  });
  
  return Object.entries(skillCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([skill, count]) => ({ skill, count }));
};

// Helper function to add a new job
export const addNewJob = (jobData) => {
  const newId = Math.max(...jobsData.map(job => job.id)) + 1;
  const newJob = {
    id: newId,
    ...jobData,
    postedDate: new Date().toISOString().split('T')[0],
    candidates: 0,
    status: "Active"
  };
  
  jobsData.unshift(newJob);
  return newJob;
};

// Helper function to update job status
export const updateJobStatus = (jobId, newStatus) => {
  const jobIndex = jobsData.findIndex(job => job.id === jobId);
  if (jobIndex !== -1) {
    jobsData[jobIndex].status = newStatus;
    return jobsData[jobIndex];
  }
  return null;
};

// Helper function to get job by ID
export const getJobById = (jobId) => {
  return jobsData.find(job => job.id === jobId);
};

// Helper function to delete job
export const deleteJob = (jobId) => {
  const jobIndex = jobsData.findIndex(job => job.id === jobId);
  if (jobIndex !== -1) {
    return jobsData.splice(jobIndex, 1)[0];
  }
  return null;
};

export default {
  jobsData,
  departments,
  experienceLevels,
  interviewTypes,
  locations,
  statusOptions,
  skillsList,
  getJobStats,
  getJobsByDepartment,
  getTopSkills,
  addNewJob,
  updateJobStatus,
  getJobById,
  deleteJob
};