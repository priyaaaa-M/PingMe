import { StreamChat } from "stream-chat";
import "dotenv/config";




const apiKey = process.env.STEAM_API_KEY
const apiSecret = process.env.STEAM_API_SECRET


if(! apiKey || !apiSecret){
     console.log("Stream API  key or Secret is missing ");
}

const streamClient = StreamChat.getInstance(apiKey,apiSecret);

export const upsertStreamUser = async (userData)=>{
      
       try{
            await streamClient.upsertUsers([userData]);
             return userData
       }catch(error){
          console.log("Error Creating Stream user:",error); 
       }


}


export const generateStreamToken = (userId)=>{
           try{
               //ensure userId is string
              const userIdstr = userId.toString();
              return streamClient.createToken(userIdstr);

           }catch(error){
              console.log("Error Generating Stream token:",error);
              resizeBy.status(500).json({message:"Internal Server Error"})
           }
};

