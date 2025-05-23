// app/api/getDroneLocation/route.tsfetchDroneLocation
import { NextResponse } from "next/server";

type Data = {
  status: string;
};

export async function GET() {
  try {
    const droneState = await fetch(
      "https://pi.newinfotech.org/get-drone-state",
      {
        cache: "no-store",
      },
    );

    if (!droneState.ok) {
      return NextResponse.json(
        { error: `Upstream HTTP ${droneState.status}` },
        { status: droneState.status },
      );
    }

    const data = (await droneState.json()) as Data;
    return NextResponse.json(data);
  } catch (e) {
    console.error("Error fetching drone location:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
