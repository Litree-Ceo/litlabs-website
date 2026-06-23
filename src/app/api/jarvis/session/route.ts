import { NextRequest, NextResponse } from "next/server";
import { withRateLimit } from "@/lib/rate-limiter";

export const runtime = "nodejs";

/**
 * POST /api/jarvis/session
 * Fetches an ephemeral token from OpenAI for the Realtime API (WebRTC).
 */
async function handler(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 });
    }

    const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-realtime-preview-2024-12-17",
        voice: "verse",
        instructions: "You are JARVIS, a sophisticated AI assistant. Respond concisely and professionally.",
        input_audio_format: "pcm16",
        output_audio_format: "pcm16",
        modalities: ["audio", "text"],
        turn_detection: {
          type: "server_vad",
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 500,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI Session Error:", errorData);
      return NextResponse.json({ error: "Failed to create session" }, { status: response.status });
    }

    const data = await response.json();

    // Return the ephemeral token (client_secret) to the frontend
    return NextResponse.json({
      client_secret: data.client_secret.value,
      model: data.model,
      expires_at: data.expires_at
    });

  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// Rate limit: 20 session creations per hour per IP
export const POST = withRateLimit(handler, 20, 3600);
