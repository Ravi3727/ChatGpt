// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { uploadOnCloudinary } from "@/app/packages/cloudinary/uploadOnCloudinary";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file: File | null = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${file.name.split(".")[0]}-${Date.now()}`;

  try {
    const uploadResult: any = await uploadOnCloudinary(buffer, filename);

    return NextResponse.json({
      message: "Upload successful",
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    });
  } catch (error) {
    return NextResponse.json({ error: "Upload failed", details: error }, { status: 500 });
  }
}
