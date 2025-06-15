// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { uploadOnCloudinary } from "@/app/packages/cloudinary/uploadOnCloudinary";
import fs from "fs";

// Promisify multer's single upload middleware
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file: File | null = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${file.name.split(".")[0]}-${Date.now()}`;
  const tempPath = `./public/temp/${filename}`;

  // Write buffer to temp file
  fs.writeFileSync(tempPath, buffer);

  const uploadResult = await uploadOnCloudinary(tempPath);

  if (!uploadResult) {
    return NextResponse.json({ error: "Cloudinary upload failed" }, { status: 500 });
  }

  return NextResponse.json({
    message: "Upload successful",
    url: uploadResult.secure_url,
    public_id: uploadResult.public_id,
  });
}
