import React from 'react'
import { MdCancel } from "react-icons/md";
import { IoIosVideocam } from "react-icons/io";
import useRoom from '../store/useRoomStore';


const AllUsersInRoom = () => {
  const {closeRoom,selectedRoom}=useRoom()
  return (
    <div className="p-2 pb-2 border-b border-base-300 bg-base-100 shadow-sm flex-shrink-0 hover:bg-base-200">
      <div className="flex justify-between items-center space-x-3">
        <div className='text-3xl text-primary font-extrabold'>
          {selectedRoom?.roomName}
        </div>
     
        <div className="flex items-center space-x-2">
          <div className="flex-none">
        <button className="btn btn-ghost text-red-600 text-2xl" onClick={()=>closeRoom()}>x</button>
      </div>
        </div>
      </div>
    </div>
)}

export default AllUsersInRoom