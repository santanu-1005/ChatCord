import { MessageSquare } from 'lucide-react';
import React from 'react'


const EmptyChatContainer = () => {
  return (
    <div className='flex-1 md:bg-[#1c1d25] md:flex flex-col justify-center items-center hidden duration-1000 transition-all '>
        <MessageSquare className='w-[10vw] h-[10vh]'/>
        <span className='mt-2'>Send And Receive Messages in Real Time</span>
    </div>
  )
}

export default EmptyChatContainer;
