// lib/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

console.log("Cloudinary configuration:", {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!
});



export const uploadOnCloudinary = async (localFilePath: string) => {
  try {
    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    });
    fs.unlinkSync(localFilePath); 
    return result;
  } catch (err) {
    fs.unlinkSync(localFilePath); 
    console.error("Cloudinary upload error:", err);
    return null;
  }
};
