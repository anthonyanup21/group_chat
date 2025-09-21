import {Router} from "express"

import {joinRoom,createRoom,deleteRoom,getJoinedRooms, leaveRoom} from "../controllers/room.controller.js"
import {verifyToken} from "../middleware/verifyToken.js"


const roomRoute=Router()
roomRoute.get("/get-joined-rooms",verifyToken,getJoinedRooms)

roomRoute.post("/join-room",verifyToken,joinRoom)

roomRoute.post("/create-room",verifyToken,createRoom)

roomRoute.delete("/delete-room/:id",verifyToken,deleteRoom)

roomRoute.patch("/leave-room/:id",verifyToken,leaveRoom)


export default roomRoute