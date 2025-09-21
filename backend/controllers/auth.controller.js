import User from "../models/user.model.js"
import { hashPassword,compareHashedPassword } from "../utils/hashPassword.js"
import { generateJWT } from "../utils/generateJWT.js"
import jwt from "jsonwebtoken"

export const login=async (req,res)=>{

    try {

        const {email,password}=req.body
        const user=await User.findOne({email})
        if (!user) return res.status(400).json({message:"invalid creaditionals",success:false})
        const isMatch=await compareHashedPassword(password,user.password)
        if (!isMatch) return res.status(400).json({message:"invalid creaditionls",success:false})
        await generateJWT(user._id,res)
        
        res.status(200).json({success:true,user:{...user._doc,password:null}})

    } catch (error) {
        res.status(500).json({message:"internal server error"})
        console.log("error in login cotroller",error)
        
    }

}

export const signup=async(req,res)=>{

    try {

        const {fullName,email,password}=req.body
        const ifUserExist=await User.findOne({email})
        if (ifUserExist) return res.status(400).json({message:"user alreday exist",success:false})
        const hashedPassword=await hashPassword(password)
        const user=new User({fullName,email,password:hashedPassword})
        if (user){
            await generateJWT(user._id,res)
            await user.save()
            res.status(200).json({success:true,user:{...user._doc,password:null}})

        }
   
    } catch (error) {
        res.status(500).json({message:"internal server error"})
        console.log("error in signup cotroller",error)
        
    }

    
}

export const logout=(req,res)=>{

    try {
        res.clearCookie("jwt")
        res.status(200).json({success:"true",message:"logged out successfully"})
        
    } catch (error) {
        console.log("error in logout controller",error)
        res.status(500).json({success:"false",message:"internal server error"})

        
    }

}

export const checkAuth=async(req,res)=>{
    try {
        //check if user exist
        const user=await User.findById(req.userId).select("-password")
        res.status(200).json({success:true,user})
    } catch (error) {
        console.log("error in checkAuth controller",error)
        res.status(500).json({super:false,message:"internal server error"})
        
    }

}




