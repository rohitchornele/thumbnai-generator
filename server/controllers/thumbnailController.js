import userModel from "../models/userModel.js";
import OpenAI from "openai";
import "dotenv/config";
import { getUploadSignature } from "../config/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: process.env.OPENROUTER_BASE_URL,
});

function buildCloudinaryUrl(publicId) {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  return `https://res.cloudinary.com/${cloud}/image/upload/b_brown,c_pad,h_720,w_1280/${publicId}`;
}


async function handleGenerateFromCloudinary({ prompt, publicId }) {
  
  const cloudinaryUrl = buildCloudinaryUrl(publicId);

  // const instruction = `Return exactly one data URL (data:image/png;base64,...) with no extra text or code fences.`;

  const response = await client.chat.completions.create({
    model: "google/gemini-2.5-flash-image-preview:free",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful AI image generation and editing assistant who helps in generating images and edit them as per the user's instruction.",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `${prompt}`,
          },
          {
            type: "image_url",
            image_url: {
              url: cloudinaryUrl,
            },
          },
        ],
      },
    ],
  });

  const content = response.choices[0].message?.images?.[0]?.image_url?.url || "";
  console.log("Content = ", content.slice(0,1000))

  return content;
}


async function uploadDataUrlToCloudinary(dataUrl, folder = "generated") {
  // Cloudinary supports base64 data URIs in upload API
  const res = await cloudinary.v2.uploader.upload(dataUrl, {
    folder,
    overwrite: true,
  });
  return res.secure_url;
}

export const generateThumbnail = async (req, res) => {
  try {
    const { userId } = req;
    const { prompt, cloudinaryPublicId } = req.body;
    console.log("body = ", req.body);

    const user = await userModel.findById(userId);

    console.log("User = ", user);
    console.log("prompt = ", prompt);
    // console.log("cloudinaryPublicId = ", cloudinaryPublicId);

    if (!user || !prompt) {
      return res.json({
        success: false,
        message: "Missing Details",
      });
    }

    if (user.creditBalance === 0 || user.creditBalance < 0) {
      return res.json({
        success: false,
        message: "No Credit Balance",
        creditBalance: user.creditBalance,
      });
    }

    const base_64_url = await handleGenerateFromCloudinary({
      prompt,
      publicId: cloudinaryPublicId,
    });

    console.log("image url.... = ", base_64_url.slice(0,1000));

    // const base64Image = bytes.toString("base64");
    const resultImage = `${base_64_url}`;

    await userModel.findByIdAndUpdate(user._id, {
      creditBalance: user.creditBalance - 1,
    });

    return res.json({
      success: true,
      message: "Image Generated",
      creditBalance: user.creditBalance - 1,
      resultImage,
    });
  } catch (error) {
    throw new Error(`Error in controller : ${error}`);
  }
};
