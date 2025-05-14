// app/api/getDroneLocation/route.tsfetchDroneLocation
import { NextResponse } from "next/server";

type Data = {
  latitude: number;
  longitude: number;
};

export async function GET() {
  try {
    const upstream = await fetch(
      "https://pi.newinfotech.org/get-gps-location",
      { cache: "no-store" },
    );

    if (!upstream.ok) {
      return NextResponse.json(
        { error: `Upstream HTTP ${upstream.status}` },
        { status: upstream.status },
      );
    }

    const data = (await upstream.json()) as Data;
    return NextResponse.json(data);
  } catch (e) {
    console.error("Error fetching drone location:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
