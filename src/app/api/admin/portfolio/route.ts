import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { portfolioSchema } from "@/lib/validations";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await prisma.portfolioItem.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = portfolioSchema.parse(body);

    const item = await prisma.portfolioItem.create({
      data: {
        ...data,
        thumbnailUrl: data.thumbnailUrl || null,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, ...rest } = body;
    const data = portfolioSchema.parse(rest);

    const item = await prisma.portfolioItem.update({
      where: { id },
      data: {
        ...data,
        thumbnailUrl: data.thumbnailUrl || null,
      },
    });

    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const item = await prisma.portfolioItem.findUnique({ where: { id } });
  if (item) {
    await deleteFromCloudinary(item.mediaUrl).catch(() => {});
    if (item.thumbnailUrl) {
      await deleteFromCloudinary(item.thumbnailUrl).catch(() => {});
    }
  }

  await prisma.portfolioItem.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
