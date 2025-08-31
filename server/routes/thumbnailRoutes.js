import express from "express";
import userAuth from "../middlewares/auth.js";
import { generateThumbnail } from "../controllers/thumbnailController.js";


const thumbnailRouter = express.Router()

thumbnailRouter.post('/generate-thumbnail', userAuth, generateThumbnail)

export default thumbnailRouter;