import * as fs from "fs";
import * as path from "path";

export interface UploadResult {
  fileUrl: string;
  filePath: string;
}

export async function saveUploadedFile(
  buffer: Buffer,
  fileName: string,
  userId: string
): Promise<UploadResult> {
  // In a real production environment on Vercel, you would upload this to
  // Vercel Blob, AWS S3, or Supabase Storage because serverless functions are stateless.
  // For local development and demonstration, we will save to the public/uploads directory.
  
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  
  // Ensure the directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Create a unique filename
  const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
  const uniqueName = `${userId}_${Date.now()}_${cleanFileName}`;
  const filePath = path.join(uploadDir, uniqueName);

  // Write file
  await fs.promises.writeFile(filePath, buffer);

  // Return the public URL and filePath
  return {
    fileUrl: `/uploads/${uniqueName}`,
    filePath,
  };
}

export async function deleteUploadedFile(fileUrl: string): Promise<void> {
  // If local, delete from public/uploads
  if (fileUrl.startsWith("/uploads/")) {
    const fileName = fileUrl.replace("/uploads/", "");
    const filePath = path.join(process.cwd(), "public", "uploads", fileName);
    
    try {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    } catch (err) {
      console.error(`Failed to delete local file: ${filePath}`, err);
    }
  }
}
