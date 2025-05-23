// app/api/getDroneLocation/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = await fetch("https://pi.newinfotech.org/pause-mission", {
      method: "POST",
      cache: "no-store", // Wyłącza buforowanie
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        {
          error: `Upstream HTTP ${response.status}: ${errorText || response.statusText}`,
        },
        { status: response.status },
      );
    }

    const responseData: unknown = await response.json();
    return NextResponse.json(responseData);
  } catch (e) {
    console.error("Error initiating drone mission:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
