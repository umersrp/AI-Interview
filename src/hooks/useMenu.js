// hooks/useMenu.js
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const useMenus = () => {
  const [menus, setMenus] = useState([]);
  const { user, userRole } = useSelector((state) => state.auth);
  
  useEffect(() => {
    // Get user role from Redux store or localStorage
    const role = userRole || user?.type || localStorage.getItem("userRole");
    
    if (role) {
      // Define all menu items with proper structure for Navmenu
      const allMenuItems = [
        {
          title: "Dashboard",
          icon: "heroicons-outline:home",
          link: "/dashboard",
          roles: ["admin", "company", "student", "tutor"] // All roles can see dashboard
        },
        {
          title: "Jobs",
          icon: "heroicons-outline:briefcase",
          link: "/job-listing",
          roles: ["company"] // Only company can see jobs
        },
        {
          title: "Tenant",
          icon: "heroicons-outline:users",
          link: "/tenant-listing",
          roles: ["admin"] // Only admin can see tenant
        },
        {
          title: "Candidates",
          icon: "heroicons-outline:users",
          link: "/candidates",
          roles: ["company"] // Only company can see candidates
        },
        {
          title: "Interviews",
          icon: "heroicons-outline:calendar",
          link: "/interviews",
          roles: ["company", "student", "tutor"] // Company, student, tutor can see interviews
        },
        {
          title: "Reports & Analytics",
          icon: "heroicons-outline:chart-bar",
          link: "/reportAnalytics",
          roles: ["company"] // Only company can see reports
        },
        {
          title: "Settings",
          icon: "heroicons-outline:cog",
          link: "/settings",
          roles: ["company", "student", "tutor"] // Company, student, tutor can see settings
        },
        {
          title: "Company",
          icon: "heroicons-outline:building-office",
          link: "/company-listing",
          roles: ["admin"] // Only admin can see company
        }
      ];

      // Filter menus based on user role
      const filteredMenus = allMenuItems.filter(item => 
        item.roles.includes(role)
      );
      
      console.log("User Role:", role); // Debug log
      console.log("Filtered Menus:", filteredMenus); // Debug log
      
      setMenus(filteredMenus);
    } else {
      setMenus([]);
    }
  }, [user, userRole]);

  return menus;
};

export default useMenus;