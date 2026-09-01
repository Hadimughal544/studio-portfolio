import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { packageSchema } from "@/lib/validations";

// Public pages that render package data and must refresh after an edit.
function revalidatePackages() {
  revalidatePath("/packages");
  revalidatePath("/booking");
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const packages = await prisma.package.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json(packages);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = packageSchema.parse(body);

    const pkg = await prisma.package.create({ data });
    revalidatePackages();
    return NextResponse.json(pkg, { status: 201 });
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
    const data = packageSchema.parse(rest);

    const pkg = await prisma.package.update({
      where: { id },
      data,
    });

    revalidatePackages();
    return NextResponse.json(pkg);
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

  await prisma.package.delete({ where: { id } });
  revalidatePackages();
  return NextResponse.json({ success: true });
}
