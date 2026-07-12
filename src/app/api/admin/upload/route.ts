import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSignedUploadParams } from "@/lib/cloudinary";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { filename, folder = "portfolio" } = await request.json();

    if (!filename) {
      return NextResponse.json({ error: "filename is required" }, { status: 400 });
    }

    const result = getSignedUploadParams(folder, filename);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Upload sign error:", error);
    return NextResponse.json(
      { error: "Failed to generate upload signature" },
      { status: 500 },
    );
  }
}
