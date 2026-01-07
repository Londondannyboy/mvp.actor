import { NextResponse } from "next/server";

/**
 * Hume EVI Access Token Endpoint
 *
 * Fetches an access token from Hume's OAuth2 endpoint.
 * Required env vars:
 *   - HUME_API_KEY
 *   - HUME_SECRET_KEY
 */
export async function GET() {
  const apiKey = process.env.HUME_API_KEY;
  const secretKey = process.env.HUME_SECRET_KEY;

  if (!apiKey || !secretKey) {
    console.error("[Hume Token] Missing HUME_API_KEY or HUME_SECRET_KEY");
    return NextResponse.json(
      { error: "Hume API keys not configured" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch("https://api.hume.ai/oauth2-cc/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${apiKey}:${secretKey}`).toString("base64")}`,
      },
      body: "grant_type=client_credentials",
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("[Hume Token] Error fetching token:", error);
      return NextResponse.json(
        { error: "Failed to fetch Hume token" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ accessToken: data.access_token });
  } catch (error) {
    console.error("[Hume Token] Exception:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
