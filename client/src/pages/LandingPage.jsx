import React, { useState } from "react";
import { MessageSquare } from "lucide-react";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    title: "Simple Messaging",
    description:
      "Send and receive messages in real-time with a clean interface.",
  },
  {
    title: "Group Chats",
    description:
      "Create group conversations to collaborate with multiple people.",
  },
  {
    title: "Profile Settings",
    description: "Customize your profile and control your preferences.",
  },
  {
    title: "Secure",
    description: "Your conversations are private and protected.",
  },
];

const LandingPage = () => {
  const { login, register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formType, setFormType] = useState('login');
  const navigate = useNavigate();
  const [error, setError] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (formType === 'login') {
        const success = await login(email, password);
        // const token = localStorage.getItem('token');
        if (success) {
          navigate('/chat');
        } else {
          setError('Login failed. Please check your credentials.');
        }
      } else {
        const success = await register(name, email, password);
        if (success) {
          setName('');
          setEmail('');
          setPassword('');
          setFormType('login');
          // setError('Registration successful! Please log in.');
        }
      }
    } catch (error) {
      console.error('Authentication error', error);
      setError('Error: ' + (error.response?.data?.message || 'Something went wrong'));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFormType = () => {
    setFormType((prev) => (prev === 'login' ? 'register' : 'login'));
    setError('')
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 to-teal-50">
      {/* Right Section*/}
      <div className="flex-1 hidden lg:block">
        <div className="flex flex-col items-center justify-center h-full p-8">
          <div className="max-w-md">
            <div className="flex items-center mb-6">
              {/* Heading Of the App*/}
              <div className="p-3 bg-indigo-600 rounded-lg mr-2">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">ChatCord</h1>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Stay connected with your friends and colleagues
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              A minimalistic and beautiful chat application with intuitive
              design and real-time messaging.
            </p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Login Register Section */}
      <div className="w-full lg:w-2/5 flex items-center justify-center">
        <div className="w-full max-w-md p-8">
          <div className="lg:hidden flex items-center mb-8 justify-center">
            <div className="p-3 bg-indigo-600 rounded-lg">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h1 className="ml-3 text-3xl font-bold text-gray-900">ChatCord</h1>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {formType === "login" ? "Welcome Back" : "Create Your Account"}
            </h2>
            {error && (
              <div className="mb-4 text-sm text-red-600 bg-red-100 p-2 rounded">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              {formType === "register" && (
                <Input
                  label="Full Name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  fullWidth
                />
              )}
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                fullWidth
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                fullWidth
              />

              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                fullWidth
                className="mt-6"
              >
                {formType === "login" ? "Sign In" : "Create Account"}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {formType === 'login'
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <button
                  type="button"
                  onClick={toggleFormType}
                  className="text-indigo-600 font-medium hover:text-indigo-500 focus:outline-none"
                >
                  {formType === 'login' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
