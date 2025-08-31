import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// POST /api/cloudinary/signature
export async function getUploadSignature(req, res) {
  try {
    const { folder = "temp" } = req.body || {};
    const timestamp = Math.floor(Date.now() / 1000);

    // Only include parameters Cloudinary expects to be signed
    const paramsToSign = { timestamp, ...(folder ? { folder } : {}) };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET
    );

    return res.json({
      success: true,
      signature,
      timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder: folder || undefined,
      expiresIn: 3600, // signatures valid ~1 hour per docs
    });
  } catch (e) {
    console.log("Error in cloudinary", e)
    return res.status(500).json({ success: false, message: e.message });
  }
}