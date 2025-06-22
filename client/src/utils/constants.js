export const HOST = import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTES = "api/auth";
export const REGISTER_ROUTE = `${AUTH_ROUTES}/register`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const GET_USER_INFO = `${AUTH_ROUTES}/user-info`;
export const UPDATE_PROFILE_ROUTE = `${AUTH_ROUTES}/update-profile`;

export const CHAT_ROUTES = "api/chats";
export const INTERACT_USERS = `${CHAT_ROUTES}/interacted-user`;
export const GET_MESSAGES_WITH_USER = `${CHAT_ROUTES}/with/:userId`
export const SEND_MESSAGE_TO_USER = `${CHAT_ROUTES}/to/:recipientId`;