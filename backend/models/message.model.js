import mongoose from "mongoose"

const messageSchema=mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true

    },
    senderName:{
        type:String,
        required:true
    },
    roomId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Room",
        required:true
    },
    text:{
        type:String,
        required:true
    }

},{timestamps:true})

const Message=mongoose.model("Message",messageSchema)

export default Message