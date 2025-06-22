import React, { useEffect, useRef} from "react";
import { userAppStore } from "../../../../../../store";
import { apiClient } from "../../../../../../services/api-client";
import { GET_MESSAGES_WITH_USER } from "../../../../../../utils/constants";
import socket from '../../../../../../services/socket';
const MessageContainer = () => {
  const { selectedChat, userInfo, messages, setMessages, addMessage} = userAppStore();
  const bottomRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat || !userInfo) return;
      try {
        const url = GET_MESSAGES_WITH_USER.replace(":userId", selectedChat._id);
        const res = await apiClient.get(url);
        setMessages(res.data);
      } catch (error) {
        console.error(
          "Error fetching messages:",
          error?.response?.data || error.message || error
        );
      }
    };
    fetchMessages();
  }, [selectedChat, setMessages, userInfo]);

  useEffect(() => {
  const handleReceive = (msg) => {
    console.log("📥 Received message via socket:", msg);

    // Match the current chat — ensure selectedChat is ready
    if (
      msg.sender === selectedChat?._id ||
      msg.recipient === selectedChat?._id
    ) {
      addMessage(msg); // ✅ single message
    } else {
      console.log("⛔ Not current chat, ignoring");
    }
  };

  socket.on("receiveMessage", handleReceive);
  return () => socket.off("receiveMessage", handleReceive);
}, [selectedChat, addMessage])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Utility to get initials from name
  const getInitials = (name) => {
    if (!name) return "U";
    const names = name.trim().split(" ");
    return names
      .map((n) => n[0].toUpperCase())
      .join("")
      .slice(0, 2);
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-2 md:px-6 md:w-[65vw] bg-gray-100">
      {messages.length === 0 && (
        <p className="text-gray-400 text-center mt-10">No Messages Yet</p>
      )}

      <div className="flex flex-col space-y-4">
        {messages.map((msg) => {
          const isSentByUser = msg.sender === userInfo.id;
          const senderName = isSentByUser ? userInfo.name : selectedChat.name;

          return (
            <div
              key={msg._id}
              className={`flex items-end ${
                isSentByUser ? "justify-end" : "justify-start"
              }`}
            >
              {/* Avatar for received messages */}
              {!isSentByUser && (
                <div className="mr-2">
                  <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-semibold">
                    {getInitials(senderName)}
                  </div>
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`flex ${
                  isSentByUser ? "justify-end" : "justify-start"
                } flex-grow`}
              >
                <div
                  className={`inline-block px-4 py-2 rounded-xl text-sm break-words shadow-md ${
                    isSentByUser
                      ? "bg-blue-600 text-white rounded-br-none max-w-[75%]"
                      : "bg-white text-gray-800 rounded-bl-none max-w-full"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div ref={bottomRef}></div>
    </div>
  );
};

export default MessageContainer;
