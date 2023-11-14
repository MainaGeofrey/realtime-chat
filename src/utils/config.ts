export const SERVER = {
  ENDPOINT: "https://cloud.appwrite.io/v1",
  PROJECT_ID: "64cced226fa211528fbf",
  DATABASE_ID: "production",
  COLLECTION_ID_CHAT_MESSAGES: "chat-messages",
  COLLECTION_ID_CHATS: "chats",
  COLLECTION_ID_USERS: "user-details",
  COLLECTION_ID_GROUPS: "groups",
  COLLECTION_ID_GROUP_MESSAGES: "group-messages",
  BUCKET_ID_USER_AVATARS: "user-avatars",
  BUCKET_ID_CHAT_ATTACHMENTS: "chat-message-attachments",
  BUCKET_ID_GROUP_AVATARS: "group-avatars",
  BUCKET_ID_GROUP_ATTACHMENTS: "group-message-attachments",
  DOCUMENT_ID_GLOBAL_CHAT: "6549f5725a18249f363d",
  FUNCTION_ID_FUNCS: "funcs",
  OAUTH_SUCCESS: "https://vchat-messenger.vercel.app/login",
  OAUTH_FAILURE: "https://vchat-messenger.vercel.app/register",
};

console.log(import.meta.env.VITE_CLIENT_KEY);
