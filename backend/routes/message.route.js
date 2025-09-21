import {Router} from "express"

import {getAllMessage,sendMessage,getSenderName} from "../controllers/message.controller.js"
import {verifyToken} from "../middleware/verifyToken.js"

const messageRoute=Router()

messageRoute.get("/allMessages/:id",getAllMessage)

messageRoute.post("/sendMessage/:id",verifyToken,sendMessage)

messageRoute.get("/get-sender-name/:id",getSenderName)

export default messageRoute