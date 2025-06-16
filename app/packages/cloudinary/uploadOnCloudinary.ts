// packages/cloudinary/uploadOnCloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function uploadOnCloudinary(buffer: Buffer, filename: string) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { public_id: filename, resource_type: "auto", folder: "uploads" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    ).end(buffer); 
  });
}





// export async function uploadOnCloudinary(localFilePath: string) {
//   try {
//     if (!localFilePath) return null;

//     const response = await cloudinary.uploader.upload(localFilePath, {
//       resource_type: "auto",
//     });

//     // fs.unlinkSync(localFilePath); // delete local file after successful upload
//     console.log("Upload successful:", response);
//     return response;
//   } catch (error) {
//     // fs.unlinkSync(localFilePath); // delete even if failed
//     return null;
//   }
// };
