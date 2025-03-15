import { NextResponse } from "next/server";
import { auth } from "@/lib/firebase";

export async function POST(request: Request) {
  try {
    // Get the token from the Authorization header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Missing or invalid authorization header" },
        { status: 401 }
      );
    }

    const token = authHeader.split("Bearer ")[1];

    // Set the token in an HTTP-only cookie
    return NextResponse.json(
      { message: "Login successful" },
      {
        status: 200,
        headers: {
          "Set-Cookie": `auth-token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`,
        },
      }
    );
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "An error occurred during login" },
      { status: 500 }
    );
  }
}
