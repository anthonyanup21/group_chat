import mongoose from "mongoose"

const roomSchema=new mongoose.Schema({
    roomName:{
        type:String,
        required:true,
        unique:true

    },
    description:{
        type:String,
        required:true,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    password:{
        type:String,
        required:true
    },
    members:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }]

},{timestamps:true})

const Room =mongoose.model("Room",roomSchema)
export default Room