
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);

  // Get authentication code from Supabase
  const code = requestUrl.searchParams.get("code");

  // Get requested redirect destination
  const next = requestUrl.searchParams.get("next") ?? "/patient/dashboard";

  // Prevent external redirects
  const redirectUrl = new URL(next, requestUrl.origin);

  const safeNext =
    next.startsWith("/") &&
    !next.startsWith("//") &&
    redirectUrl.origin === requestUrl.origin
      ? redirectUrl
      : new URL("/patient/dashboard", requestUrl.origin);

  // Handle missing authentication code
  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=auth-callback", requestUrl.origin)
    );
  }

  try {
    // Initialize Supabase server client
    const supabase = await createClient();

    // Exchange authentication code for session
    const { error } =
      await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Authentication callback error:", error.message);

      return NextResponse.redirect(
        new URL("/login?error=auth-callback", requestUrl.origin)
      );
    }

    // Redirect after successful authentication
    return NextResponse.redirect(safeNext);

  } catch (error) {
    console.error("Unexpected authentication error:", error);

    return NextResponse.redirect(
      new URL("/login?error=auth-callback", requestUrl.origin)
    );
  }
}
