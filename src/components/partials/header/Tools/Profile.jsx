import React, { useState, useEffect } from "react";
import Dropdown from "@/components/ui/Dropdown";
import Icon from "@/components/ui/Icon";
import { Menu } from "@headlessui/react";
import { useNavigate } from "react-router-dom";

import UserAvatar from "@/assets/images/all-img/user.png";

const Profile = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("User Name");

  useEffect(() => {
    // Get user name from localStorage when component mounts
    const getUserName = () => {
      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          return parsedUser.name || parsedUser.email || "User Name";
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
      return "User Name";
    };

    setUserName(getUserName());
  }, []); // Empty dependency array means this runs once on mount

  const profileLabel = () => {
    return (
      <div className="flex items-center">
        <div className="flex-1 ltr:mr-[10px] rtl:ml-[10px]">
          <div className="lg:h-8 lg:w-8 h-7 w-7 rounded-full">
            <img
              src={UserAvatar}
              alt=""
              className="block w-full h-full object-cover rounded-full"
            />
          </div>
        </div>
        <div className="flex-none text-slate-600 dark:text-white text-sm font-normal items-center lg:flex hidden overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="overflow-hidden text-ellipsis whitespace-nowrap w-auto block">
            {userName}
          </span>
          <span className="text-base inline-block ltr:ml-[10px] rtl:mr-[10px]">
            <Icon icon="heroicons-outline:chevron-down"></Icon>
          </span>
        </div>
      </div>
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  const ProfileMenu = [
    {
      label: "Logout",
      icon: "heroicons-outline:login",
      action: () => handleLogout(),
    },
  ];

  return (
    <Dropdown label={profileLabel()} classMenuItems="w-[180px] top-[58px]">
      {ProfileMenu.map((item, index) => (
        <Menu.Item key={index}>
          {({ active }) => (
            <div
              onClick={() => item.action()}
              className={`${
                active
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-600"
              } block cursor-pointer px-4 py-2`}
            >
              <div className="flex items-center">
                <span className="block text-xl ltr:mr-3 rtl:ml-3">
                  <Icon icon={item.icon} />
                </span>
                <span className="block text-sm">{item.label}</span>
              </div>
            </div>
          )}
        </Menu.Item>
      ))}
    </Dropdown>
  );
};

export default Profile;

