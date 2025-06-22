import React, { useState, useEffect } from "react";
import { userAppStore } from "../../store";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { FaPlus, FaTrash } from "react-icons/fa";
import Avatar from "./components/Avatar";
import { apiClient } from "../../services/api-client";
import { UPDATE_PROFILE_ROUTE } from "../../utils/constants";

const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = userAppStore();
  const [name, setName] = useState(userInfo.name);
  const [image, setImage] = useState(userInfo.image);
  const [profileSetup, setProfileSetup] = useState(userInfo.profileSetup);

  const [token, setToken] = useState(null);
  const [tokenLoading, setTokenLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) setToken(storedToken);
    setTokenLoading(false);
  }, []);

  const handleImgChange = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const token = localStorage.getItem('token');
    if (!token) { console.error("No token Found"); return; }
    try {
      const uploadResponse = await apiClient.post(
        UPDATE_PROFILE_ROUTE,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (uploadResponse.data?.url) {
        setImage(uploadResponse.data.url);
      }
    } catch (error) {
      console.error("Upload Failed", error);
    }
  }

  const saveChanges = async () => {
    if (!token) {
      console.error("No Auth token found");
      return;
    }

    try {
      const response = await apiClient.post(
        UPDATE_PROFILE_ROUTE,
        {
          name,
          image,
          profileSetup,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true, // Optional: only if your backend uses cookies
        }
      );
      setProfileSetup(true);
      if (response.status === 201) {
        setUserInfo(response.data.user);
        navigate('/chats');
      }
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  if (tokenLoading) {
    return <div className="text-white">Loading profile...</div>;
  }
  return (
    <div className="bg-[#1b1c24] min-h-screen flex items-center justify-center">
      <div className="w-full max-w-2xl bg-gray-800 flex flex-col rounded-xl h-full max-h-3xl p-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute  text-white hover:text-red-400 transition-colors"
          aria-label="Go back"
        >
          <IoArrowBack size={24} />
        </button>

        {/* Avatar Section */}
        <div className="flex  justify-center mb-6">
          <Avatar name={name} src={image} onImagechange={handleImgChange} />
        </div>

        {/* Info Section */}
        <div className="flex flex-col space-y-4 text-white">
          <div className="flex items-center space-x-6">
            <label htmlFor="email" className="text-white font-medium w-24">
              Email :
            </label>
            <input
              type="email"
              disabled
              value={userInfo.email}
              className="bg-amber-50 text-black h-10 p-4 rounded-lg cursor-not-allowed w-full"
            />
          </div>

          <div className="flex items-center space-x-6">
            <label htmlFor="name" className="text-white font-medium w-24">
              Name :
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              // disabled={!isEditing}
              className="bg-amber-50 text-black h-10 p-4 rounded-lg w-full"
            />
          </div>
        </div>

        {/* Save Changes */}
        <div className="flex justify-center items-center mt-6">
          <button
            onClick={saveChanges}
            className="bg-green-500  text-white py-2 px-6 rounded-lg  cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
