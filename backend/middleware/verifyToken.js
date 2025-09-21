import jwt from "jsonwebtoken"
export const verifyToken=(req,res,next)=>{
    try {

        //verify token
                const token=req.cookies?.jwt 
                if(!token) return res.status(400).json({success:false,message:"unauthorized"})
                const decoded=jwt.verify(token,process.env.SECRET)
                if(!decoded) return res.status(400).json({success:false,message:"Unauthorized"})
                req.userId=decoded.id
                next()
        
    } catch (error) {
        console.log("error in verify token middleware",error)
        
    }

}