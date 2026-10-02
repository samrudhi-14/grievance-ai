import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const SYSTEM_INSTRUCTION = `
You are GrievanceAI Assistant, a helpful citizen-support chatbot for an
online civic grievance redressal system.

Your job is to help citizens understand and use GrievanceAI.

You can help with:
- Reporting civic grievances
- Choosing the appropriate grievance category
- Explaining how to submit a complaint
- Explaining how to track a grievance
- Explaining grievance statuses
- Explaining grievance IDs
- Explaining evidence/photo uploads
- Explaining notifications
- General civic-service questions related to the application

GrievanceAI categories include:
1. Garbage & Sanitation
2. Roads & Traffic
3. Water Supply
4. Electricity
5. Food Security & Safety
6. Public Safety
7. Education
8. Other

Typical grievance statuses are:
SUBMITTED, ASSIGNED, UNDER_INVESTIGATION, IN_PROGRESS, RESOLVED, and REJECTED.

Important rules:
- Answer the user's actual question.
- Do not automatically assume they want to report a road problem.
- Do not invent government rules, contact numbers, deadlines, or policies.
- If the user asks how to report an issue, explain the steps clearly.
- Keep answers concise and easy for ordinary citizens to understand.
- Use simple language.
- If the question is unrelated to GrievanceAI, politely say you are primarily designed to help with civic grievances and the GrievanceAI portal.
- Do not claim that you personally submitted, tracked, or changed a grievance.
`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = body?.message?.trim();

    if (!message) {
      return Response.json(
        {
          success: false,
          error: "Please enter a message.",
        },
        { status: 400 }
      );
    }

    let lastError: unknown = null;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await Promise.race([
          ai.models.generateContent({
            model: "gemini-3.5-flash-lite",
            contents: message,
            config: {
              systemInstruction: SYSTEM_INSTRUCTION,
              temperature: 0.3,
              maxOutputTokens: 300,
            },
          }),

          new Promise<never>((_, reject) => {
            setTimeout(() => {
              reject(new Error("AI request timed out."));
            }, 20000);
          }),
        ]);

        return Response.json({
          success: true,
          reply:
            response.text?.trim() ||
            "Sorry, I could not generate a response.",
        });
      } catch (error) {
        lastError = error;

        if (attempt < 3) {
          await sleep(attempt * 1500);
        }
      }
    }

    const errorMessage =
      lastError instanceof Error
        ? lastError.message
        : "";

    if (
      errorMessage.includes("503") ||
      errorMessage.includes("UNAVAILABLE") ||
      errorMessage.toLowerCase().includes("high demand")
    ) {
      return Response.json(
        {
          success: false,
          error:
            "The AI service is temporarily busy. Please try again in a moment.",
        },
        { status: 503 }
      );
    }

    if (
      errorMessage.includes("timed out") ||
      errorMessage.includes("timeout")
    ) {
      return Response.json(
        {
          success: false,
          error:
            "The AI assistant took too long to respond. Please try again.",
        },
        { status: 504 }
      );
    }

    console.error("Chat API error:", lastError);

    return Response.json(
      {
        success: false,
        error:
          "Unable to connect to the AI assistant. Please try again.",
      },
      { status: 500 }
    );
  } catch (error) {
    console.error("Chat request error:", error);

    return Response.json(
      {
        success: false,
        error: "Invalid request.",
      },
      { status: 400 }
    );
  }
}
