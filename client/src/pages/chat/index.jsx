import React, { useEffect } from 'react'
import { userAppStore } from '../../store'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ChatContainer from './components/chat-container';
import EmptyChatContainer from './components/empty-chat-container';
import ContactContainer from './components/contact-container';

const Chat = () => {
  const {userInfo} = userAppStore();
  const navigate = useNavigate();
  const { selectedChat } = userAppStore();

  useEffect(() => {
    if(!userInfo.profileSetup){
      toast('Please Complete Your Profile', {icon: '⚠️'});
      navigate("/profile");
    }
  }, [userInfo, navigate]);

  return (
    <div className='flex h-[100vh] text-white overflow-hidden'>
      <ContactContainer />
      { selectedChat ? <ChatContainer /> : <EmptyChatContainer />}
    </div>
  )
}

export default Chat
