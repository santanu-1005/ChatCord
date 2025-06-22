import { X } from "lucide-react";
import React from "react";
import { userAppStore } from "../../../../../../store";

const ChatHeader = () => {
  const { setSelectedChat, selectedChat } = userAppStore();
  const {userInfo} = userAppStore();

  const handleClose = () => {
    setSelectedChat(null);
  };

  return (
    <div className="h-[9vh] border-b border-[#2f303b] flex items-center justify-between px-6">
      <h2 className="text-white text-lg font-semibold">
        {selectedChat?.name}
      </h2>
      <button
        onClick={handleClose}
        className="text-neutral-500 hover:text-white transition-all"
        aria-label="Close chat"
      >
        <X />
      </button>
    </div>
  );
};

export default ChatHeader;
