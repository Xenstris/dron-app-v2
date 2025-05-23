// app/api/getDroneLocation/route.tsfetchDroneLocation
import { NextResponse } from "next/server";

type Data = {
  status: string;
};

export async function GET() {
  try {
    const connectionState = await fetch(
      "https://pi.newinfotech.org/get-connection-state",
      { cache: "no-store" },
    );

    if (!connectionState.ok) {
      return NextResponse.json(
        { error: `Upstream HTTP ${connectionState.status}` },
        { status: connectionState.status },
      );
    }

    const data = (await connectionState.json()) as Data;
    return NextResponse.json(data);
  } catch (e) {
    console.error("Error fetching drone location:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
