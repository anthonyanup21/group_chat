import Message from "../models/message.model.js"
import User from "../models/user.model.js"
import Room from "../models/room.model.js"
import {io} from "../server.js"
import { currentRoom,usersSocketId } from "../server.js"

export const getAllMessage=async(req,res)=>{
    //id==roomId
    try {
        const {id}=req.params
        const messages=await Message.find({roomId:id})
        res.status(200).json({success:true,messages})
    } catch (error) {
        console.log("error in getAllMessage controller",error)
        res.status(500).json({success:false,message:"internal server error"})
        
    }
}

export const sendMessage=async(req,res)=>{
        //id==roomId
    try {
        const {id:roomId}=req.params
        const {text}=req.body
        const senderId=req.userId

        const user=await User.findById(senderId)
        const isRoomExist=await Room.findById(roomId)
        if(!isRoomExist) return res.status(400).json({message:"room doesnt exist"})

        const newMessage=new Message({
            senderId,
            senderName:user.fullName,
            roomId,
            text
        })
        await newMessage.save()
        const senderSocketId=usersSocketId[senderId]
        const senderRoom=currentRoom[senderSocketId]
        if (senderRoom){
            io.to(currentRoom[usersSocketId[senderId]]).emit("newMessage",newMessage)
        }


  

        res.status(200).json({success:true,newMessage})
    } catch (error) {
        console.log("error in sendMessage controller",error)
        res.status(500).json({success:false,message:"internal server error"})
        
    }



    
}

export const getSenderName=async(req,res)=>{
    const {id}=req.params
    const userName=await User.findById(id)
    res.status(200).json({success:true,senderName:userName.fullName})

}


