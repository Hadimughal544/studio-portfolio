import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAddonPricing } from "@/lib/site-content";
import {
  computeContractTotal,
  computeCustomTotal,
  computePaymentSplit,
} from "@/lib/pricing";
import { contractSchema } from "@/lib/validations";

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = contractSchema.parse(body);

    const [packages, addonPricing] = await Promise.all([
      prisma.package.findMany(),
      getAddonPricing(),
    ]);

    const totalFee = computeContractTotal(data.days, packages, addonPricing);
    const { bookingFeeAmount, eventDayAmount, albumDeliveryAmount } =
      computePaymentSplit(totalFee);

    const days = data.days.map((day) => {
      if (day.selectionType === "PACKAGE") {
        const pkg = packages.find((p) => p.id === day.packageId);
        return {
          ...day,
          packageName: pkg?.name,
          packagePrice: pkg?.price,
        };
      }
      return { ...day, customTotal: computeCustomTotal(day, addonPricing) };
    });

    const contract = await prisma.contract.create({
      data: {
        brideName: data.brideName,
        groomName: data.groomName,
        bookedFrom: data.bookedFrom,
        clientPhone: data.clientPhone,
        clientEmail: data.clientEmail,
        coverageTypes: data.coverageTypes,
        socialMediaConsent: data.socialMediaConsent,
        days,
        totalFee,
        bookingFeeAmount,
        eventDayAmount,
        albumDeliveryAmount,
        signatureName: data.signatureName,
        agreedToTerms: data.agreedToTerms,
      },
    });

    return NextResponse.json({ success: true, id: contract.id }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }
    console.error("Contract error:", error);
    return NextResponse.json(
      { error: "Failed to create contract" },
      { status: 500 },
    );
  }
}
