import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(request: Request) {
  try {
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "Gemini API key is not configured.",
        },
        { status: 500 }
      );
    }

    const body = await request.json();

    const message =
      typeof body.message === "string"
        ? body.message.trim()
        : "";

    if (!message) {
      return NextResponse.json(
        {
          success: false,
          error: "Please enter a message.",
        },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey,
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: message,
      config: {
        systemInstruction: `
You are GrievanceAI Assistant, a helpful civic grievance support chatbot.

Help citizens with:
- Submitting civic grievances.
- Choosing the appropriate grievance category.
- Understanding priority levels.
- Understanding grievance tracking.
- Knowing what information and evidence to provide.
- Understanding statuses such as Submitted, Assigned,
  Under Investigation, In Progress, Resolved and Rejected.
- Writing clear and useful grievance descriptions.

Rules:
- Be friendly, concise and easy to understand.
- Do not claim to be a government official.
- Do not claim that you contacted any government department.
- Never invent grievance IDs, status updates, department actions,
  policies or case information.
- If a user asks about a specific grievance, ask for the grievance ID
  when necessary.
- Encourage accurate location, description and evidence.
- For immediate danger or emergencies, advise the citizen to contact
  the appropriate emergency service.
`,
      },
    });

    const reply = response.text;

    if (!reply) {
      throw new Error("Gemini returned an empty response.");
    }

    return NextResponse.json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("Gemini chat error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to connect to the AI assistant.",
      },
      { status: 500 }
    );
  }
}