import { StreamChat } from "stream-chat";
import { ENV } from "./env.js";

const apikey = ENV.STREAM_API_KEY;
const apisecret = ENV.STREAM_API_SECRET;

if (!apikey || !apisecret) {
  console.log("STREAM_API_KEY or STREAM_API_SECRET missing");
}

// Single Stream client
export const chatClient = StreamChat.getInstance(apikey, apisecret);

// Create or update user
export const upsertStreamUser = async (userData) => {
  try {

    console.log("STREAM DATA:", userData);
    await chatClient.upsertUsers([userData]);
    console.log("Stream user added/updated");
  } catch (error) {
    console.error(error);
  }
};

// Delete user
export const deleteStreamUser = async (userId) => {
  try {
    await chatClient.deleteUser(userId);
    console.log("Stream chat user deleted");
  } catch (error) {
    console.error(error);
  }
};