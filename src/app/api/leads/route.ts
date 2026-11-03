import { NextRequest, NextResponse } from "next/server";
import { submitConsultationLead } from "@/features/crm/leads-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, phone, email, goal, source } = body;

    if (!fullName || !phone) {
      return NextResponse.json(
        { error: "Vui lòng cung cấp họ tên và số điện thoại." },
        { status: 400 }
      );
    }

    const lead = await submitConsultationLead({
      fullName,
      phone,
      email,
      goal,
      source: source || "website_inquiry",
    });

    return NextResponse.json({ success: true, lead }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
