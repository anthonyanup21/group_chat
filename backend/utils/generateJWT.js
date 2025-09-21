import jwt from "jsonwebtoken"


export const generateJWT=(id,res)=>{
   try {
     const payload={id}
     const secret=process.env.SECRET
     const options={expiresIn:"7d"}
     //generate jwt
     const token=jwt.sign(payload,secret,options)
     //set cookie
     res.cookie("jwt",token,{
             maxAge:7*24*60*60*1000 //7days in miliseconds
         }
     )
   } catch (error) {
    console.log("error in generateJWT",error)
    
   }
}