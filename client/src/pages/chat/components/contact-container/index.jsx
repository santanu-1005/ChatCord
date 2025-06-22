import React, { useEffect, useState } from "react";
import {
  Settings,
  Users,
  MessageCircle,
  MessageSquare,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { userAppStore } from "../../../../store";
import { apiClient } from "../../../../services/api-client";
import { INTERACT_USERS } from "../../../../utils/constants";

const ContactContainer = () => {
  const navigate = useNavigate();
  const { setUserInfo, setSelectedChat } = userAppStore();
  const [users, setUsers] = useState([]);

  const handleSettings = () => {
    navigate("/profile");
  };

  const handleLogout = () => {
    setUserInfo(null); // Reset user info in store
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    navigate("/auth"); // Redirect to login
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if(!token){
          console.error("No token found in localStorage");
          return;
        }
        const { data } = await apiClient.get(INTERACT_USERS, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch interacted users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <aside className="relative md:w-[15vw] lg:w-[15vw] xl:w-[18vw] bg-[#1b1c24] border-r-2 border-[#2f303b] text-white h-screen overflow-y-auto flex flex-col">
      {/* Header with Logo */}
      <header className="px-4 py-5 border-b border-[#2f303b] flex items-center space-x-3">
        <MessageSquare />
        <h1 className="text-xl font-semibold tracking-wide">ChatCord</h1>
      </header>

      {/* Section: Direct Messages */}
      <section className="px-4 py-3">
        <div className="flex items-center space-x-2 text-sm font-medium uppercase text-gray-400 mb-2 cursor-pointer whitespace-nowrap">
          <MessageCircle className="h-4 w-4" />
          <h2>Direct Messages</h2>
        </div>
        {/* Add direct messages list */}
        <ul className="space-y-2">
          {users.length > 0 ? (
            users.map((user) => (
              <li
                key={user._id}
                className="cursor-pointer hover:bg-gray-700 px-3 py-2 rounded transition"
                onClick={() => setSelectedChat(user)}
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={user.image || "/default-avatar.png"}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="text-sm font-medium text-white">{user.name}</div>
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-500 text-sm px-2">No conversations yet</p>
          )}
        </ul>
      </section>

      {/* Section: Group Messages */}
      <section className="px-4 py-3">
        <div className="flex items-center space-x-2 text-sm font-medium uppercase text-gray-400 mb-2 cursor-pointer whitespace-nowrap">
          <Users className="h-4 w-4" />
          <h2>Group Messages</h2>
        </div>
        {/* Add group messages list */}
      </section>

      {/* Spacer to push settings down */}
      <div className="flex-grow" />

      {/* Profile / Settings Section at Bottom */}
      <section
        className="px-4 py-3 mb-3 border-t border-[#2f303b]"
        onClick={handleSettings}
      >
        <div className="flex items-center space-x-2 text-sm font-medium uppercase text-gray-400 cursor-pointer">
          <Settings className="h-4 w-4" />
          <h2>Settings</h2>
        </div>

        <div
          className="flex items-center space-x-2 mt-2 text-sm font-medium uppercase text-red-400 cursor-pointer"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <h2>Logout</h2>
        </div>
      </section>
    </aside>
  );
};

export default ContactContainer;
