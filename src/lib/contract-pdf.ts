import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import type { Contract } from "@/generated/prisma/client";
import type { StoredContractDay } from "@/lib/validations";
import { STUDIO_INFO } from "@/lib/constants";
import { formatDate, formatPrice } from "@/lib/utils";

const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
const MARGIN = 50;
const LINE_HEIGHT = 18;

type Cursor = {
  doc: PDFDocument;
  page: PDFPage;
  y: number;
  font: PDFFont;
  bold: PDFFont;
};

function newPage(doc: PDFDocument): PDFPage {
  return doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
}

function ensureSpace(cursor: Cursor, needed = LINE_HEIGHT) {
  if (cursor.y - needed < MARGIN) {
    cursor.page = newPage(cursor.doc);
    cursor.y = PAGE_HEIGHT - MARGIN;
  }
}

function writeLine(
  cursor: Cursor,
  text: string,
  { size = 11, bold = false, gap = LINE_HEIGHT }: { size?: number; bold?: boolean; gap?: number } = {},
) {
  ensureSpace(cursor, gap);
  cursor.page.drawText(text, {
    x: MARGIN,
    y: cursor.y,
    size,
    font: bold ? cursor.bold : cursor.font,
    color: rgb(0.1, 0.1, 0.1),
  });
  cursor.y -= gap;
}

export async function generateContractPdf(
  contract: Contract,
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  const cursor: Cursor = {
    doc,
    page: newPage(doc),
    y: PAGE_HEIGHT - MARGIN,
    font,
    bold,
  };

  writeLine(cursor, STUDIO_INFO.name, { size: 20, bold: true, gap: 26 });
  writeLine(cursor, `${STUDIO_INFO.phone} · ${STUDIO_INFO.email}`, { size: 10 });
  writeLine(cursor, STUDIO_INFO.address, { size: 10, gap: 26 });

  writeLine(cursor, "Wedding / Event Photography Contract", { size: 14, bold: true, gap: 24 });

  writeLine(cursor, `Bride: ${contract.brideName}`, { bold: true });
  writeLine(cursor, `Groom: ${contract.groomName}`, { bold: true });
  writeLine(cursor, `Booked From: ${contract.bookedFrom}`);
  writeLine(cursor, `Phone: ${contract.clientPhone}`);
  writeLine(cursor, `Email: ${contract.clientEmail}`, { gap: 22 });

  writeLine(cursor, `Coverage: ${contract.coverageTypes.join(", ") || "—"}`);
  writeLine(cursor, `Social Media Consent: ${contract.socialMediaConsent ? "Yes" : "No"}`, { gap: 22 });

  writeLine(cursor, "Event Days", { size: 13, bold: true, gap: 20 });
  const days = (contract.days as unknown as StoredContractDay[]) ?? [];
  for (const day of days) {
    writeLine(cursor, `Day ${day.dayNumber} — ${day.coverageLabel}`, { bold: true });
    writeLine(cursor, `Location: ${day.location}`, { size: 10 });
    writeLine(cursor, `Date/Time: ${day.dateTime}`, { size: 10 });
    if (day.selectionType === "PACKAGE") {
      writeLine(
        cursor,
        `Package: ${day.packageName ?? "—"} (${formatPrice(day.packagePrice ?? 0)})`,
        { size: 10 },
      );
    } else {
      writeLine(
        cursor,
        `Custom: ${day.photographers ?? 0} photographer(s), ${day.videographers ?? 0} videographer(s), ${day.drone ?? 0} drone — ${formatPrice(day.customTotal ?? 0)}`,
        { size: 10 },
      );
    }
    cursor.y -= 6;
  }

  cursor.y -= 6;
  writeLine(cursor, "Payment Terms", { size: 13, bold: true, gap: 20 });
  writeLine(cursor, `Total Fee: ${formatPrice(contract.totalFee)}`, { bold: true });
  writeLine(cursor, `Booking Fee (50%): ${formatPrice(contract.bookingFeeAmount)}`);
  writeLine(cursor, `Due on Event Day (40%): ${formatPrice(contract.eventDayAmount)}`);
  writeLine(cursor, `Due on Album Delivery (10%): ${formatPrice(contract.albumDeliveryAmount)}`, { gap: 22 });

  writeLine(cursor, "Signature", { size: 13, bold: true, gap: 20 });
  writeLine(cursor, `Signed by: ${contract.signatureName}`);
  writeLine(cursor, `Agreed to Terms: ${contract.agreedToTerms ? "Yes" : "No"}`);
  writeLine(cursor, `Submitted: ${formatDate(contract.createdAt)}`);
  writeLine(cursor, `Status: ${contract.status}`);

  return doc.save();
}
