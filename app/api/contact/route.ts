import { NextResponse } from "next/server";
import { getDbPool } from "@/lib/db/mysql";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const message = String(body.message || "").trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        {
          success: false,
          error: "Name, email, and message are required.",
        },
        { status: 400 }
      );
    }

    await getDbPool().execute(
      `
        INSERT INTO contacts (name, email, message)
        VALUES (?, ?, ?)
      `,
      [name, email, message]
    );

    return NextResponse.json({
      success: true,
      message: "Your message has been submitted successfully.",
    });
  } catch (error) {
    console.error("Contact API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to submit your message.",
      },
      { status: 500 }
    );
  }
}