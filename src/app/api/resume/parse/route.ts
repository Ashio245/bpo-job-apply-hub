import { NextRequest, NextResponse } from "next/server";
import { parseResumeFile } from "@/lib/resume-parser";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const parsedData = await parseResumeFile(buffer, file.name);

    return NextResponse.json(parsedData);
  } catch (err: any) {
    console.error("Error parsing CV on server:", err);
    return NextResponse.json(
      { error: "Failed to parse document: " + err.message },
      { status: 500 }
    );
  }
}
