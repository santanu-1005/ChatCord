import React, { Suspense, lazy, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { userAppStore } from "./store";
import { apiClient } from "./services/api-client";
import { GET_USER_INFO } from "./utils/constants";
import socket from "./services/socket";

const Auth = lazy(() => import("./pages/auth"));
const Chat = lazy(() => import("./pages/chat"));
const Profile = lazy(() => import("./pages/profile"));

const PrivateRoute = ({ children }) => {
  const { userInfo } = userAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

const AuthRoute = ({ children }) => {
  const { userInfo } = userAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chats" /> : children;
};

const App = () => {
  const { userInfo, setUserInfo } = userAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const token  = localStorage.getItem("token");
        const response = await apiClient.get(GET_USER_INFO
        );
        const user = response?.data;

        if (response.status === 200 && user && user.id) {
          setUserInfo(user);
          socket.auth = { token };
          socket.connect();
          socket.emit("register", user.id);
        } else {
          console.warn("Invalid user info response:", response);
          setUserInfo(undefined);
        }
      } catch (error) {
        console.error(
          "❌ Error fetching user info:",
          error?.response?.data || error.message
        );
        setUserInfo(undefined);
      } finally {
        setLoading(false);
      }
    };

    getUserInfo();
  }, [setUserInfo]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Connected to socket:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading page...</div>}>
        <Routes>
          <Route
            path="/auth"
            element={
              <AuthRoute>
                <Auth />
              </AuthRoute>
            }
          />
          <Route
            path="/chats"
            element={
              <PrivateRoute>
                <Chat />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/auth" />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
