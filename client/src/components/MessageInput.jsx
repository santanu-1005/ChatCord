import React, { useState } from 'react';
import { Paperclip, Send, Smile } from 'lucide-react'; // Importing icons from the lucide-react library
import  Button  from './Button'; // Importing a custom Button component

// MessageInput component accepts a prop called 'onSendMessage', which is a function to handle sending messages
const MessageInput = ({ onSendMessage }) => {
  // useState hook to manage the state of the message input
  const [message, setMessage] = useState('');

  // handleSubmit function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents the default form submission behavior
    if (message.trim()) { // Checks if the message is not empty
      onSendMessage(message); // Calls the onSendMessage function passed as a prop with the current message
      setMessage(''); // Clears the input after the message is sent
    }
  };

  return (
    // Form element with an onSubmit handler for message submission
    <form 
      onSubmit={handleSubmit} 
      className="border-t bg-white px-4 py-3" // Tailwind CSS classes for styling the form
    >
      {/* Container for the message input section */}
      <div className="flex items-center gap-2">
        
        {/* Attachment Button */}
        <Button
          type="button" // Specifies that this button does not submit the form
          variant="ghost" // Custom styling variant for the button (e.g., transparent background)
          className="p-2 rounded-full text-gray-500 hover:text-gray-700" // Tailwind classes for padding, rounded corners, text color, and hover effect
        >
          <Paperclip size={20} /> {/* Paperclip icon from lucide-react */}
        </Button>
        
        {/* Message input field */}
        <div className="flex-1">
          <input
            type="text" // The input field is for text input
            value={message} // The value of the input is bound to the 'message' state
            onChange={(e) => setMessage(e.target.value)} // Updates the 'message' state whenever the input changes
            placeholder="Type a message..." // Placeholder text for the input field
            className="w-full rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" // Tailwind classes for styling
          />
        </div>
        
        {/* Emoji Button */}
        <Button
          type="button"
          variant="ghost"
          className="p-2 rounded-full text-gray-500 hover:text-gray-700"
        >
          <Smile size={20} /> {/* Smile icon from lucide-react */}
        </Button>
        
        {/* Send Button */}
        <Button
          type="submit" // This button will submit the form
          variant="primary" // Custom primary button styling
          className="p-2 rounded-full" // Tailwind classes for padding and rounded corners
          disabled={!message.trim()} // Disables the button if the message is empty or just whitespace
        >
          <Send size={20} /> {/* Send icon from lucide-react */}
        </Button>
      </div>
    </form>
  );
};

export default MessageInput;
