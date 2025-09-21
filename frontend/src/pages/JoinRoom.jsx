import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import useRoom from '../store/useRoomStore'
import {useNavigate } from 'react-router'


const JoinRoom = () => {
  const [roomName, setroomName] = useState("")
  const [password, setpassword] = useState("")
  const {joinRoom,isJoiningRoom}=useRoom()
  const navigate=useNavigate()

  const handleSubmit=async(e)=>{
    e.preventDefault()
    const room=await joinRoom(roomName,password)
    navigate(`/room/:${room._id}`,{replace:true})

  }



 
  return (
    <div>
      <Navbar/> 
      <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-md shadow-xl bg-base-100">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center text-primary">Join Room</h2>
          
          <form className="space-y-7" onSubmit={handleSubmit}>
            {/* Room Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text m-1">Room Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter room name"
                className="input input-bordered w-full"
                value={roomName}
                onChange={(e)=>(setroomName(e.target.value))}
              />
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text m-1">Password</span>
              </label>
              <input
                type="password"
                placeholder="Enter password"
                className="input input-bordered w-full"
                value={password}
                onChange={(e)=>(setpassword(e.target.value))}
              />
            </div>

            {/* Submit */}
            <div className="form-control mt-6">
              <button className="btn btn-accent w-full">{isJoiningRoom?"Loading...":"Join Room"}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
      
      </div>
  )
}

export default JoinRoom