import React from 'react'
import InputContainer from "../components/InputContainer"
import MessageContainer from "../components/MessageContainer"
import AllUsersInRoom from "../components/AllUsersInRoom"
import { useEffect } from 'react'
import useRoom from '../store/useRoomStore.js'
import { useNavigate } from 'react-router'


const Room = () => { 
  const navigate=useNavigate()
  const {selectedRoom}=useRoom()
  useEffect(() => {
    if (!selectedRoom) {
      navigate("/", { replace: true })
    }
  }, [selectedRoom])
 
  return (
    <div className="flex flex-col h-screen ">
      <div >   <AllUsersInRoom/></div>
   
      {/* Messages Area (scrollable) */}
      <div className="flex-1 overflow-y-auto ">
        <MessageContainer />
      </div>

      {/* Input Area (sticks to bottom) */}
      <div >
        <InputContainer />
      </div>
    </div>
  )
}

export default Room
