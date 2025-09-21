import React, { useState } from "react";
import useMessage from "../store/useMessageStore";

const InputContainer = () => {
  const [text, settext] = useState("");
  const {sendMessage}=useMessage()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await sendMessage(text)
    settext("")
    
  };
  return (
    <form onSubmit={handleSubmit}>
      
      <div className="p-3 border-t border-base-300 bg-base-200 flex gap-2">
        <input
          type="text"
          placeholder="Type a message…"
          className="input input-bordered w-full"
          value={text}
          onChange={(e) => settext(e.target.value)}
        />
       
       

        <button className="btn btn-primary" type="submit" disabled={!text.trim()}>
          Send
        </button>
      </div>
    </form>
  );
};

export default InputContainer;
