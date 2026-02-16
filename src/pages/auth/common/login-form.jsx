import React, { useEffect, useState, useRef } from "react";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Checkbox from "@/components/ui/Checkbox";
import Button from "@/components/ui/Button";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "@/store/api/auth/authApiSlice";
import { setUser } from "@/store/api/auth/authSlice";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const LoginForm = () => {
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth);
  const formRef = useRef(null);

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    getValues,
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.isAuth) {
      // Redirect based on user type
      if (user?.user?.type === "admin") {
        navigate("/dashboard");
      } else if (user?.user?.type === "company") {
        navigate("/dashboard");
      } else {
        navigate("/dashboard");
      }
    }
  }, [user?.isAuth, user?.user?.type, navigate]);

  // Handle Enter key press globally on the form
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && !isLoading) {
        e.preventDefault();
        
        // Get autofilled values from DOM
        const emailInput = document.querySelector('input[name="email"]');
        const passwordInput = document.querySelector('input[name="password"]');
        
        const actualEmail = emailInput?.value;
        const actualPassword = passwordInput?.value;

        // If both fields have values (autofilled or typed), submit
        if (actualEmail && actualPassword) {
          // Update form values
          setValue("email", actualEmail);
          setValue("password", actualPassword);
          
          // Trigger form submission
          if (formRef.current) {
            formRef.current.dispatchEvent(
              new Event('submit', { cancelable: true, bubbles: true })
            );
          }
        }
      }
    };

    // Add listener to document to catch Enter from anywhere in the form
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLoading, setValue]);

  const onSubmit = async (data) => {
    // Get actual input values from DOM (handles autofill)
    const emailInput = document.querySelector('input[name="email"]');
    const passwordInput = document.querySelector('input[name="password"]');
    
    const actualEmail = emailInput?.value || data.email;
    const actualPassword = passwordInput?.value || data.password;

    // Simple client-side validation
    if (!actualEmail || !actualEmail.includes('@')) {
      toast.error("Please enter a valid email");
      return;
    }
    
    if (!actualPassword) {
      toast.error("Please enter your password");
      return;
    }

    try {
      // Make API call to login endpoint
      const response = await login({
        email: actualEmail,
        password: actualPassword,
      }).unwrap();

      console.log("Full API Response:", response); // Debug log

      const responseData = response?.data;
      
      if (!responseData?.token) {
        throw new Error("Invalid credentials");
      }

      const userData = responseData.user;
      
      // Store user data in Redux
      dispatch(setUser({
        ...userData,
        token: responseData.token,
        isAuth: true
      }));

      // Store in localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", responseData.token);
      localStorage.setItem("userRole", userData.type);
      localStorage.setItem("userId", userData._id);
      
      toast.success("Login Successful");
      
      // Redirect based on user type
      if (userData?.type === "admin") {
        navigate("/tenant-listing");
      } else if (userData?.type === "company") {
        navigate("/dashboard");
      } else {
        navigate("/dashboard");
      }
      
    } catch (error) {
      console.error("Full error object:", error);
      const errorMessage = error?.data?.message || error.message || "Login failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  const [checked, setChecked] = useState(false);

  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Textinput
        name="email"
        label="Email"
        type="email"
        register={register}
        error={errors.email}
        className="h-[48px]"
        placeholder="Enter your email"
      />
      <Textinput
        name="password"
        label="Password"
        type="password"
        register={register}
        error={errors.password}
        className="h-[48px]"
        placeholder="Enter your password"
      />
      <div className="flex justify-between">
        <Checkbox
          value={checked}
          onChange={() => setChecked(!checked)}
          label="Keep me signed in"
        />
        <Link
          to="/forgot-password"
          className="text-sm text-slate-800 dark:text-slate-400 leading-6 font-medium"
        >
          Forgot Password?
        </Link>
      </div>

      <Button
        type="submit"
        text="Sign in"
        className="btn btn-dark block w-full text-center"
        isLoading={isLoading}
      />
    </form>
  );
};

export default LoginForm;