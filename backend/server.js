import express from "express"
import { connectDb } from "./db/connectDB.js"
import dotenv from "dotenv"
import roomRoute from "./routes/room.route.js"
import message from "./routes/message.route.js"
import authRoute from "./routes/auth.route.js"
import cors from "cors"
import cookieParser from "cookie-parser"


import { Server } from "socket.io"
import http from "http"

dotenv.config()
const app=express()
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

const server=http.createServer(app)

export const io=new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        credentials:true
    }
})

export var currentRoom={}
export var usersSocketId={}
io.on("connection",(socket)=>{
    console.log("A user connected",socket.id)
    const userId=socket.handshake.query.userId
    usersSocketId[userId]=socket.id

    socket.on("changeRoom",(roomId)=>{
        if (roomId==null){
            socket.leave(currentRoom[socket.id])
        }else{
            currentRoom[socket.id]=roomId
            socket.join(currentRoom[socket.id])
            
        }
 

    })

    socket.on("disconnect",()=>{
        console.log("a user disconnected",socket.id)
        delete currentRoom[socket.id]
        delete usersSocketId[userId]
    })
})


app.use("/api/auth",authRoute)
app.use("/api/room",roomRoute)
app.use("/api/message",message)


connectDb().then(()=>
    server.listen(3000,()=>{
    console.log("server running at port 3000")
}))