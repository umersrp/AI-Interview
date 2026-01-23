import React from "react";

const Input = ({ className = "", ...props }) => {
  return (
    <input
      className={`border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white ${className}`}
      {...props}
    />
  );
};

export default Input;