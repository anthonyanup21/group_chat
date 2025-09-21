import mongoose from "mongoose"

export const  connectDb=async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("database connected successfully")
        
    } catch (error) {
        console.log("error while connecting database",error)
        process.exit(1)
        
    }

}