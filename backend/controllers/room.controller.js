import Room from "../models/room.model.js"
import User from "../models/user.model.js"
import Message from "../models/message.model.js"
import mongoose from "mongoose"
import { io, usersSocketId } from "../server.js"



export const joinRoom=async (req,res)=>{
        try {
                const {roomName,password}=req.body
                const room=await Room.findOne({roomName})
                if (!room || room.password!=password ) return res.status(400).json({success:false,message:"invalid room"})
        
                // if (room.members.map(id => id.toString()).includes(req.userId)) return res.status(400).json({success:false,message:"Alreday joined"})
                const user=await User.findById(req.userId)
                if (user.JoinedRooms.includes(room._id)) return res.status(400).json({success:false,message:"Alreday joined"})

                const newJonie=await Room.findOneAndUpdate(
                        {roomName},
                        {$addToSet:{members:req.userId}},
                        {new:true}
                )

                const updatedUser=await User.findByIdAndUpdate(
                        req.userId,
                        {$addToSet:{JoinedRooms:newJonie._id}},
                        {new:true}
                )
        
                res.status(200).json({success:true,room:{...newJonie._doc,password:null},user:{...updatedUser._doc,password:null}})
        } catch (error) {
                console.log("error in join room controller",error)
                res.status(500).json({success:false,message:"internal server error"})
                
        }

     
        


}

export const createRoom=async(req,res)=>{
        try {
                const {roomName,description,password}=req.body
                const isRoomExist=await Room.findOne({roomName})
                if (isRoomExist) return res.status(400).json({status:false,message:"Room alreday exist"})
                const newRoom=new Room({
                roomName,
                description,
                password,
                owner:req.userId
                }) 
                await newRoom.save()

                const updateUser=await User.findByIdAndUpdate(
                        req.userId,
                        {$addToSet:{JoinedRooms:newRoom._id}},
                        {new:true}
                )

                res.status(200).json({success:true,room:{...newRoom._doc,password:null},user:{...updateUser._doc,password:null}})



        } catch (error) {
                console.log("error in createRoom controller",error)
                res.status(500).json({success:false,message:"Internal Server Error"})
                
        }



}
export const deleteRoom=async(req,res)=>{
        try {
                const {id}=req.params
                const room=await Room.findById(id)
                if (!room) return res.status(400).json({success:false,message:"room doesnt exist"})
                if(room.owner.toString()!=req.userId) return res.status(400).json({success:false,message:"un Authorized"})
                await Room.findByIdAndDelete(id)

                //socket.io
                const allUsers=await User.find({JoinedRooms:room._id})
                console.log(allUsers)

                allUsers.forEach((user)=>{
                        const socketId=usersSocketId[user._id]
                        if(socketId){
                                io.to(socketId).emit("roomDeleted",id)
                                // console.log("roomdeleted emmit server",user)
                        
                        }
                        
                })

                await User.updateMany(
                        { JoinedRooms: id },
                        { $pull: { JoinedRooms: id } }
                );

                

                await Message.deleteMany({roomName:room.roomName})

                const updatedUser=await User.findById(req.userId)

                
                
                res.status(200).json({success:true,user:{...updatedUser._doc,password:null}})
                                        
        } catch (error) {
                console.log("error in deleteRoom controller",error)
                res.status(500).json({success:false,message:"Internal Server Error"})
                
        }



}

export const getJoinedRooms=async(req,res)=>{
        try {
                const id=req.userId
                const user=await User.findById(id)
                if (!user) return res.status(400).json({message:"user not found"})
                const joinedRooms=await Room.find({_id:{$in:user.JoinedRooms}}).select("-password")
                res.status(200).json({success:true,joinedRooms})
        } catch (error) {
                console.log("error in getJoinedTooms controller",error)
                res.status(500).json({success:false,message:"internal server error"})
                
        }
}

export const leaveRoom=async(req,res)=>{

        try {
                const {id:roomId}=req.params
                const userId=req.userId
      

                
        
                const updatedUser=await User.findByIdAndUpdate(userId,{$pull:{JoinedRooms:roomId}},{new:true}).select("-password")
        
                const updatedRoom=await Room.findByIdAndUpdate(roomId,{$pull:{members:userId}},{new:true}).select("-password")
                if (!updatedRoom) return res.status(400).json({success:false,message:"Room doesnt exist"})
        
                res.status(200).json({success:true,user:updatedUser,room:updatedRoom})
        } catch (error) {
                console.log("error in leaveRoom controller",error)
                res.status(500).json({success:false,message:"Internal Server Error"})
                
                
        }
        
}