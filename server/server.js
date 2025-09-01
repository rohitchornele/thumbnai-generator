import express from "express";
import cors from 'cors';
import 'dotenv/config';
import connectDb from "./config/mongodb.js";
import userRouter from "./routes/userRoutes.js";
import imageRouter from "./routes/imageRoutes.js";
import thumbnailRouter from "./routes/thumbnailRoutes.js";
import cloudinaryRouter from "./routes/cloudinaryRoutes.js";



const PORT = process.env.PORT || 4000 ;
const app = express();

app.use(cors());

app.use(express.json())

await connectDb();

app.use('/api/user', userRouter);
app.use('/api/image', imageRouter);
app.use('/api/generate', thumbnailRouter);
app.use('/api/cloudinary', cloudinaryRouter);

app.get('/', (req, res) => res.send("API Working"))

app.listen(PORT);