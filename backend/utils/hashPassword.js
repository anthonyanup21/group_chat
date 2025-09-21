import bcrypt from "bcrypt"

export const hashPassword=async (password)=>{
    const hashedPassword=await bcrypt.hash(password,10)//10= salt rounds
    return hashedPassword
}

export const compareHashedPassword=async(password,hashedPassword)=>{
    return await bcrypt.compare(password,hashedPassword)
}