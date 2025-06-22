import React, { useState } from "react";

const Tabs = ({
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  handleLogin,
  handleRegister,
  name,
  setName,
}) => {
  const [activeTab, setActiveTab] = useState("login");

  const onLoginSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  const onRegisterSubmit = (e) => {
    e.preventDefault();
    handleRegister();
  };

  return (
    <div className="w-full max-w-md p-4">
      {/* Tab Switch */}
      <div className="flex mb-6 border-b">
        <button
          onClick={() => setActiveTab("login")}
          className={`w-1/2 text-center py-2 font-semibold ${
            activeTab === "login"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setActiveTab("register")}
          className={`w-1/2 text-center py-2 font-semibold ${
            activeTab === "register"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500"
          }`}
        >
          Register
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "login" ? (
        <form onSubmit={onLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-sm">Email</label>
            <input
              type="email"
              value={email}
              className="w-full px-3 py-2 border rounded"
              placeholder="you@example.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm">Password</label>
            <input
              type="password"
              value={password}
              className="w-full px-3 py-2 border rounded"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Login
          </button>
        </form>
      ) : (
        <form onSubmit={onRegisterSubmit} className="space-y-4">
          <div>
            <label className="block text-sm">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="John"
            />
          </div>
          <div>
            <label className="block text-sm">Email</label>
            <input
              type="email"
              value={email}
              className="w-full px-3 py-2 border rounded"
              placeholder="you@example.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm">Password</label>
            <input
              type="password"
              value={password}
              className="w-full px-3 py-2 border rounded"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              className="w-full px-3 py-2 border rounded"
              placeholder="••••••••"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
            Register
          </button>
        </form>
      )}
    </div>
  );
};

export default Tabs;
