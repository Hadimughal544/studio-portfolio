import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSiteContentMap, setSiteContentValues } from "@/lib/site-content";
import { heroContentSchema } from "@/lib/validations";

const KEYS = [
  "hero.heading",
  "hero.description",
  "hero.locationLabel",
  "hero.mediaUrl",
  "hero.mediaType",
] as const;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const map = await getSiteContentMap("hero.");
  const result = Object.fromEntries(
    KEYS.map((key) => [key.replace("hero.", ""), map.get(key) ?? ""]),
  );

  return NextResponse.json(result);
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = heroContentSchema.parse(body);

    await setSiteContentValues({
      "hero.heading": data.heading,
      "hero.description": data.description,
      "hero.locationLabel": data.locationLabel,
      "hero.mediaUrl": data.mediaUrl,
      "hero.mediaType": data.mediaType,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
