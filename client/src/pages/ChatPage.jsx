import React, { useState } from 'react';
import { MessageSquare, Users, Settings, PlusCircle, Menu } from 'lucide-react'; 
import { useAuth } from '../context/AuthContext'; 
import { useChat } from '../context/ChatContext'; 
import  ChatList  from '../components/ChatList'; 
import  MessageList  from '../components/MessageList'; 
import  MessageInput  from '../components/MessageInput'; 
import  ChatHeader  from '../components/ChatHeader'; 
import  Button  from '../components/Button'; 
import  Avatar  from '../components/Avatar';

 const ChatPage = () => {
  const { currentUser, logout } = useAuth(); // Get user data and logout function from Auth context
  const { chats, activeChat, setActiveChat, sendMessage } = useChat(); // Get chat data from Chat context
  const [sidebarView, setSidebarView] = useState('chats'); // State for which sidebar view is active
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false); // State to toggle mobile sidebar

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(prev => !prev); // Toggle mobile sidebar visibility
  };

  // Function to handle back button in mobile view
  const handleBackClick = () => {
    setActiveChat(null); // Deselect active chat
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Top navigation bar */}
      <header className="bg-indigo-600 text-white p-3 flex items-center justify-between">
        <div className="flex items-center">
          <MessageSquare className="h-6 w-6 mr-2" />
          <h1 className="text-xl font-bold">ChatApp</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          {currentUser && (  // Display user information if logged in
            <>
              <span className="hidden md:inline text-sm mr-2">
                {currentUser.name}
              </span>
              <Avatar
                src={currentUser.avatar}
                name={currentUser.name}
                size="sm"
              />
              <Button
                variant="ghost"
                className="text-white hover:bg-indigo-700"
                onClick={logout}  // Logout button
              >
                Logout
              </Button>
              
              <Button
                variant="ghost"
                className="md:hidden text-white hover:bg-indigo-700"
                onClick={toggleMobileSidebar}  // Toggle mobile sidebar visibility
              >
                <Menu size={20} />
              </Button>
            </>
          )}
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside 
          className={`w-full md:w-80 bg-gray-50 border-r flex flex-col overflow-hidden ${mobileSidebarOpen || !activeChat || window.innerWidth >= 768 ? 'block' : 'hidden'}`}
        >
          {/* Sidebar tabs */}
          <div className="flex border-b">
            <button
              className={`flex-1 py-3 text-center ${sidebarView === 'chats' ? 'text-indigo-600 border-b-2 border-indigo-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setSidebarView('chats')}
            >
              <MessageSquare className="inline-block w-5 h-5 mb-1" />
              <span className="block text-xs">Chats</span>
            </button>
            <button
              className={`flex-1 py-3 text-center ${sidebarView === 'groups' ? 'text-indigo-600 border-b-2 border-indigo-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setSidebarView('groups')}
            >
              <Users className="inline-block w-5 h-5 mb-1" />
              <span className="block text-xs">Groups</span>
            </button>
            <button
              className={`flex-1 py-3 text-center ${sidebarView === 'settings' ? 'text-indigo-600 border-b-2 border-indigo-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setSidebarView('settings')}
            >
              <Settings className="inline-block w-5 h-5 mb-1" />
              <span className="block text-xs">Settings</span>
            </button>
          </div>
          
          {/* Search bar */}
          <div className="p-3 border-b">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Sidebar content */}
          <div className="flex-1 overflow-y-auto">
            {sidebarView === 'chats' && (
              <>
                <div className="p-3 border-b flex justify-between items-center">
                  <h2 className="font-medium text-gray-900">Recent Chats</h2>
                  <Button variant="ghost" className="text-indigo-600 p-1">
                    <PlusCircle size={20} />
                  </Button>
                </div>
                <ChatList 
                  chats={chats.filter(chat => !chat.isGroupChat)} 
                  activeChat={activeChat} 
                  onChatSelect={(chat) => {
                    setActiveChat(chat); // Set active chat when selected
                    setMobileSidebarOpen(false); // Close mobile sidebar
                  }} 
                />
              </>
            )}
            
            {sidebarView === 'groups' && (
              <>
                <div className="p-3 border-b flex justify-between items-center">
                  <h2 className="font-medium text-gray-900">Group Chats</h2>
                  <Button variant="ghost" className="text-indigo-600 p-1">
                    <PlusCircle size={20} />
                  </Button>
                </div>
                <ChatList 
                  chats={chats.filter(chat => chat.isGroupChat)} 
                  activeChat={activeChat} 
                  onChatSelect={(chat) => {
                    setActiveChat(chat); 
                    setMobileSidebarOpen(false); 
                  }} 
                />
              </>
            )}
            
            {sidebarView === 'settings' && (
              <div className="p-4">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Profile Settings</h2>
                
                <div className="flex items-center mb-6">
                  <Avatar 
                    src={currentUser?.avatar} 
                    name={currentUser?.name || 'User'} 
                    size="lg"
                  />
                  <div className="ml-4">
                    <button className="text-sm text-indigo-600 hover:text-indigo-700">
                      Change Photo
                    </button>
                  </div>
                </div>
                
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue={currentUser?.name}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      defaultValue={currentUser?.email}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      defaultValue={currentUser?.status}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="online">Online</option>
                      <option value="away">Away</option>
                      <option value="offline">Appear Offline</option>
                    </select>
                  </div>
                  
                  <div className="pt-4">
                    <Button variant="primary" fullWidth>
                      Save Changes
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </aside>
        
        {/* Chat area */}
        <main 
          className={`flex-1 flex flex-col ${(!mobileSidebarOpen && activeChat) || window.innerWidth >= 768 ? 'block' : 'hidden'}`}
        >
          {activeChat ? (
            <>
              <ChatHeader 
                chat={activeChat} 
                currentUser={currentUser} 
                onBackClick={handleBackClick}
              />
              <MessageList 
                messages={useChat().messages}
                currentUser={currentUser}
              />
              <MessageInput onSendMessage={sendMessage} />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 text-indigo-200 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No chat selected</h3>
                <p className="text-gray-500 mb-6">
                  Choose a conversation from the sidebar to start chatting
                </p>
                <Button
                  variant="outline"
                  onClick={() => setSidebarView('chats')}
                >
                  View conversations
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ChatPage;