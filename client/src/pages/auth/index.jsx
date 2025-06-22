import React, { useState } from "react";
import Victory from "../../assets/victory.svg"; // Adjust the path as necessary
import Tabs from "./components/Tabs";
import Background from "../../assets/login2.png"; // Adjust the path as necessary
import { toast } from "react-hot-toast";
import { apiClient } from "../../services/api-client";
import { LOGIN_ROUTE, REGISTER_ROUTE } from "../../utils/constants";
import { userAppStore } from "../../store/index"; // Adjust the path as necessary
import { useNavigate } from "react-router-dom"; // Adjust the path as necessary

const Auth = () => {
  const navigate = useNavigate();
  const { setUserInfo } = userAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");

  const validateRegister = () => {
    if (!email.length) return toast.error("Email is required");
    if (!password.length) return toast.error("Password is required");
    if (password !== confirmPassword)
      return toast.error("Passwords do not match");
    if (!name.length) return toast.error("Name is required");
    return true;
  };

  const validateLogin = () => {
    if (!email.length) return toast.error("Email is required");
    if (!password.length) return toast.error("Password is required");
    return true;
  };

  const handleRegister = async () => {
    if (validateRegister()) {
      // Handle registration logic here
      try {
        const response = await apiClient.post(REGISTER_ROUTE, {
          email,
          password,
          name,
        });
        if (response.status === 201) {
          localStorage.setItem('token', response.data.token);
          setUserInfo(response.data.user);
          navigate("/profile");
        }
        console.log({ response });
        toast.success("Registration successful!");
      } catch (error) {
        console.error("Registration error:", error);
        // toast.error(
        //   error.response?.data?.message || "Server error during registration"
        // );
      }
    }
  };

  const handleLogin = async () => {
    if (validateLogin()) {
      try {
        const response = await apiClient.post(
          LOGIN_ROUTE,
          {
            email,
            password,
          },
          { withCredentials: true }
        );

        if (response.data.user.id) {
          localStorage.setItem('token', response.data.token)
          setUserInfo(response.data.user);
          if (response.data.user.profileSetup) navigate("/chats");
        }
        console.log({ response });
        toast.success("Login successful!");
      } catch (error) {
        console.error("Login error:", error);
        toast.error(
          error.response?.data?.message || "Server error during login"
        );
      }
    }
  };

  return (
    <div className="flex h-[100vh] w-[100vw] items-center justify-center">
      <div className="max-h-[90vh] overflow-auto bg-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-2xl grid xl:grid-cols-2">
        <div className="flex flex-col gap-4 items-center justify-center px-6 py-8 overflow-y-auto">
          <div className="flex items-center justify-center flex-col text-center">
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
              <img src={Victory} alt="Victory Emogi" className="h-[80px]" />
            </div>
            <p className="font-medium mt-2">
              Fill In the Details To Get Started With Best Chat App
            </p>
          </div>

          <Tabs
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            handleLogin={handleLogin}
            handleRegister={handleRegister}
            name={name}
            setName={setName}
          />
        </div>
        <div className="hidden xl:flex justify-center items-center">
          <img
            src={Background}
            alt="Background Image"
            className="h-[600px] object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;
