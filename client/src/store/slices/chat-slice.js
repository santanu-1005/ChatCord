export const createChatSlice = (set) => ({
  selectedChat: null,
  setSelectedChat: (chat) => set({ selectedChat: chat }),

  messages: [],
  setMessages: (messages) => set({messages}),
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),
});