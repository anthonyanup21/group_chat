import React, { useEffect } from "react";
import useMessage from "../store/useMessageStore.js";
import useAuth from "../store/useAuthStore.js";
import useRoom from "../store/useRoomStore.js";


const MessageContainer = () => {
  const { messages, isGettingMessages,getAllMessages,subscribeMessage,unSubscribeMessage} = useMessage();

  const {user}=useAuth()


  useEffect(() => {
    getAllMessages();
    subscribeMessage()
    return ()=>{
      unSubscribeMessage()
    }
  }, []);

  if (isGettingMessages) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-md"></span>
      </div>
    );
  }
  console.log(messages)

  

  return (
    <div className="p-2 space-y-3 w-full">
      {messages.length == 0 ? (
        <div className="mt-50 flex justify-center items-center text-3xl font-extrabold">No Messages</div>
      ) : (
        <>
        {messages.map((data)=>(
          <div className={`chat ${data.senderId==user._id?"chat-end":"chat-start"}`}>
            <div className="chat-header">
              {data.senderName}
              {/* <time className="text-xs opacity-50">2 hours ago</time> */}
            </div>
            <div className="chat-bubble">{data.text} </div>
       
          </div>
        ))}
          

          
        </>
      )}
    </div>
  );
};

export default MessageContainer;
