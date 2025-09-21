import { Router } from "express";
import { login,signup,logout,checkAuth } from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const authRoute=Router()


authRoute.post("/login",login)

authRoute.post("/signup",signup)

authRoute.get("/logout",logout)

authRoute.get("/check-auth",verifyToken,checkAuth)









export default authRoute