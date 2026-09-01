import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { adminContractSchema, contractPatchSchema } from "@/lib/validations";
import type { AdminContractInput } from "@/lib/validations";

async function isAuthed() {
  return Boolean(await getServerSession(authOptions));
}

const unauthorized = () =>
  NextResponse.json({ error: "Unauthorized" }, { status: 401 });

/** Map the streamlined admin form payload to a Prisma `Contract` create/update input. */
function toContractData(data: AdminContractInput) {
  const days = data.days.map((day, index) => ({
    dayNumber: index + 1,
    coverageLabel: day.coverageLabel,
    location: day.location,
    dateTime: day.dateTime,
    selectionType: "CUSTOM" as const,
    customTotal: day.amount,
    manual: true,
  }));

  return {
    brideName: data.brideName,
    groomName: data.groomName,
    bookedFrom: data.bookedFrom,
    clientPhone: data.clientPhone,
    clientEmail: data.clientEmail,
    coverageTypes: data.coverageTypes,
    socialMediaConsent: data.socialMediaConsent,
    days,
    totalFee: data.totalFee,
    bookingFeeAmount: data.bookingFeeAmount,
    eventDayAmount: data.eventDayAmount,
    albumDeliveryAmount: data.albumDeliveryAmount,
    bookingFeePaid: data.bookingFeePaid,
    eventDayPaid: data.eventDayPaid,
    albumDeliveryPaid: data.albumDeliveryPaid,
    signatureName: data.signatureName,
    agreedToTerms: data.agreedToTerms,
    status: data.status,
  };
}

export async function GET() {
  if (!(await isAuthed())) return unauthorized();

  const contracts = await prisma.contract.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(contracts);
}

export async function POST(request: Request) {
  if (!(await isAuthed())) return unauthorized();

  try {
    const data = adminContractSchema.parse(await request.json());
    const contract = await prisma.contract.create({
      data: toContractData(data),
    });
    return NextResponse.json(contract, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  if (!(await isAuthed())) return unauthorized();

  try {
    const { id, ...rest } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    const data = adminContractSchema.parse(rest);
    const contract = await prisma.contract.update({
      where: { id },
      data: toContractData(data),
    });
    return NextResponse.json(contract);
  } catch {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}

/** Partial update: contract status and/or the three payment-received flags. */
export async function PATCH(request: Request) {
  if (!(await isAuthed())) return unauthorized();

  try {
    const { id, ...patch } = contractPatchSchema.parse(await request.json());
    const contract = await prisma.contract.update({ where: { id }, data: patch });
    return NextResponse.json(contract);
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("PATCH /api/admin/contracts failed:", err);
    }
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isAuthed())) return unauthorized();

  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  await prisma.contract.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
