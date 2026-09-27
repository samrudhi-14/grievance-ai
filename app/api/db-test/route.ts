import { NextResponse } from "next/server";
import dns from "node:dns/promises";

export async function GET() {
  const host = process.env.DATABASE_HOST;

  if (!host) {
    return NextResponse.json({
      success: false,
      error: "DATABASE_HOST is not set",
    });
  }

  try {
    const addresses = await dns.resolve4(host);

    return NextResponse.json({
      success: true,
      host,
      addresses,
    });
  } catch (error: unknown) {
    const err = error as {
      code?: string;
      message?: string;
    };

    return NextResponse.json({
      success: false,
      host,
      code: err.code,
      error: err.message,
    });
  }
}