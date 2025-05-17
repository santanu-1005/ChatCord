import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ChatPage from './pages/ChatPage';
import { ChatProvider } from './context/ChatContext'; // Import the ChatProvider
import { AuthProvider, useAuth } from './context/AuthContext'; // Import the AuthProvider and useAuth

// This is the component that wraps the app and checks authentication state
const AppWrapper = () => {
  const navigate = useNavigate(); // useNavigate hook to programmatically navigate
  const { isAuthenticated } = useAuth(); // Get the isAuthenticated status from the AuthContext

  // If the user is not authenticated, redirect to the landing page
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/'); // Redirect to landing page if not authenticated
    }
  }, [isAuthenticated, navigate]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/chat"
        element={
          <ChatProvider> {/* Wrap ChatPage with ChatProvider */}
            <ChatPage />
          </ChatProvider>
        }
      />
    </Routes>
  );
};

const App = () => (
  <Router>
    <AuthProvider> {/* Wrap the entire app with AuthProvider */}
      <AppWrapper /> {/* The wrapper component for handling authentication checks */}
    </AuthProvider>
  </Router>
);

export default App;
