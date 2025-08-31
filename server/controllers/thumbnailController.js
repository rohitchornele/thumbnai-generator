// controllers/generate.controller.js
import sharp from "sharp";
import { GoogleGenAI } from "@google/genai";
import userModel from "../models/userModel.js";

// Initialize Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Helper: fetch original bytes from Cloudinary with deterministic format
async function fetchCloudinaryOriginal(publicId) {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  
  // Try multiple formats with proper MIME type mapping
  const formats = [
    { format: 'jpg', mime: 'image/jpeg', ext: 'jpg' },
    { format: 'png', mime: 'image/png', ext: 'png' },
    { format: 'webp', mime: 'image/webp', ext: 'webp' }
  ];
  
  let lastError;
  
  for (const { format, mime, ext } of formats) {
    try {
      const url = `https://res.cloudinary.com/${cloud}/image/upload/f_${format}/${publicId}.${ext}`;
      
      console.log(`Trying to fetch: ${url}`);
      
      const resp = await fetch(url);
      if (resp.ok) {
        const arrayBuf = await resp.arrayBuffer();
        
        // Use the format-specific MIME type we know is correct
        const mimeType = mime;
        const filename = `${publicId}.${ext}`;
        
        // console.log(`Successfully fetched ${format} format:`, { 
        //   mimeType, 
        //   filename, 
        //   size: arrayBuf.byteLength,
        //   actualContentType: resp.headers.get("content-type")
        // });
        
        return { 
          buffer: Buffer.from(arrayBuf), 
          mimeType, 
          filename 
        };
      } else {
        console.log(`HTTP ${resp.status} for ${format} format`);
      }
    } catch (error) {
      lastError = error;
      console.log(`Failed to fetch ${format} format:`, error.message);
    }
  }
  
  throw new Error(`Failed to fetch Cloudinary asset in any format. Last error: ${lastError?.message}`);
}

async function handleGenerateFromCloudinary({ prompt, publicId }) {
  try {
    // 1) Load image bytes and reliable MIME/filename
    const { buffer: inBuf, mimeType, filename } = await fetchCloudinaryOriginal(publicId);

    // console.log("Uploading to Gemini:", { mimeType, filename, size: inBuf.length });

    // 2) Upload to Gemini Files API with explicit type and name
    const file = await ai.files.upload({
      file: inBuf,
      filename,
      config: { mimeType: "image/jpeg" }
    });

    console.log("Gemini file uploaded:", { uri: file.uri, mimeType: file.mimeType });

    // 3) Generate with the uploaded file reference
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image-preview",
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            { fileUri: file.uri, mimeType: file.mimeType },
          ],
        },
      ],
    });

    // 4) Extract first image part
    const parts = response?.candidates?.[0]?.content?.parts || [];
    const imgPart = parts.find((p) => p.inlineData?.data);
    
    if (!imgPart) {
      const textResponse = parts.find((p) => p.text)?.text || "No image data in response";
      throw new Error(`No image generated. Response: ${textResponse}`);
    }

    // 5) Normalize to PNG and optional size
    const rawOut = Buffer.from(imgPart.inlineData.data, 'base64');
    const png = await sharp(rawOut).png().toBuffer();

    return png;
  } catch (error) {
    console.error("Error in handleGenerateFromCloudinary:", error);
    throw error;
  }
}

export const generateThumbnail = async (req, res) => {
  try {
    const { userId } = req;
    const { prompt, cloudinaryPublicId } = req.body;

    // Input validation
    if (!userId || !prompt || !cloudinaryPublicId) {
      return res.json({ 
        success: false, 
        message: "Missing required fields: userId, prompt, or cloudinaryPublicId" 
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (!user.creditBalance || user.creditBalance <= 0) {
      return res.json({
        success: false,
        message: "Insufficient credit balance",
        creditBalance: user.creditBalance || 0,
      });
    }

    console.log("Processing request:", { userId, prompt, cloudinaryPublicId });

    const bytes = await handleGenerateFromCloudinary({
      prompt,
      publicId: cloudinaryPublicId,
    });

    const base64Image = bytes.toString("base64");
    const resultImage = `data:image/png;base64,${base64Image}`;

    // Update user credits
    await userModel.findByIdAndUpdate(user._id, {
      creditBalance: user.creditBalance - 1,
    });

    return res.json({
      success: true,
      message: "Image generated successfully",
      creditBalance: user.creditBalance - 1,
      resultImage,
    });
  } catch (error) {
    console.error("Generate API error:", error);
    return res.json({ 
      success: false, 
      message: error.message || "Failed to generate image"
    });
  }
};