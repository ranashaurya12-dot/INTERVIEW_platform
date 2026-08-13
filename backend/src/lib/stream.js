import {StreamChat} from "stream-chat";
import { ENV } from "./env";
const apikey=ENV.STREAM_API_KEY
const apisecret=ENV.STREAM_API_SECRET

if(!apikey || !apisecret){
    console.log("STREAM_API_KEY or STREAM_API_SECRET");
}

export const chatClient=StreamChat.getInstance(apikey,apisecret);

export const  upsertStreamUser=async(userData)=>{
    try {
        await chatClient.upsertUsers(userData);
          console.log("stream user addedf");
    } catch (error) {
        console.log(error);
    }
}

export const  upsertStreamUser=async(userId)=>{
    try {
        await chatClient.deleteUser(userId);
        console.log("stream chat deleted");
    } catch (error) {
        console.log(error);
    }
}