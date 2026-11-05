import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/features/sales/orders-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { plan, amount, method, customerName, customerEmail, customerPhone } = body;

    if (!plan || typeof amount !== "number") {
      return NextResponse.json(
        { error: "Vui lòng cung cấp gói đăng ký và số tiền hợp lệ." },
        { status: 400 }
      );
    }

    const order = await createOrder({
      plan,
      amount,
      method: method || "PayOS / VietQR",
      customerName,
      customerEmail,
      customerPhone,
      status: "paid",
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
