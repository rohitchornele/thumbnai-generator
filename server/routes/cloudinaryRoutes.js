import express from "express";
import userAuth from "../middlewares/auth.js";
import { getUploadSignature } from "../config/cloudinary.js";


const cloudinaryRouter = express.Router()

cloudinaryRouter.post('/signature', userAuth, getUploadSignature)

export default cloudinaryRouter;