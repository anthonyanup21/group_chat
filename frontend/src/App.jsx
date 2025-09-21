import React, { useEffect } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Room from "./pages/Room";
import Home from "./pages/Home"
import {Routes,Route, Navigate} from "react-router"
import useAuth from "./store/useAuthStore";
import CreateRoom from "./pages/CreateRoom";
import JoinRoom from "./pages/JoinRoom";
import useRoom from "./store/useRoomStore";
const App = () => {
  const {user,checkAuth,isCheckingAuth}=useAuth()
  const {selectedRoom} =useRoom()
  useEffect(() => {
   
    checkAuth()
  
    
  }, [checkAuth])

  // console.log(user)

  if(isCheckingAuth && !user){
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-md"></span>
      </div>
    )
  }
  
  return (
    <div>
      <Routes>
        <Route path="/login" element={!user?<Login/>:<Navigate to="/" replace/>}  />
        <Route path="/signup" element={!user?<Signup/>:<Navigate to="/" replace/>} />
        <Route path="/" element={user?<Home/>:<Navigate to="/login" replace/>}/>
        <Route path="/room/:id" element={user?<Room/>:<Navigate to="/login" replace />}/>
        <Route path="/create-room" element={user?<CreateRoom/>:<Navigate to="/login" replace/>}/>
        <Route path="/join-room" element={user?<JoinRoom/>:<Navigate to="/login" replace/>}/>



      </Routes>


     

    </div>
  );
};

export default App;
