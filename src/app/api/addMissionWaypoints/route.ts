// app/api/getDroneLocation/route.ts
import { NextResponse } from "next/server";

// Definicja typu dla pojedynczego waypointu
export type Waypoint = {
  lat: number;
  lon: number;
  alt: number;
};

// Definicja typu dla oczekiwanego payloadu POST (tablica waypointów)
type PostPayload = Waypoint[];

export async function POST(request: Request) {
  try {
    // Odczytaj payload z request body, który powinien być tablicą punktów
    // Poprawka błędu: Bezpieczne przypisanie typu z `unknown`
    const rawWaypoints: unknown = await request.json();

    // Walidacja, aby upewnić się, że payload jest poprawnym formatem
    if (
      !Array.isArray(rawWaypoints) ||
      !rawWaypoints.every(
        (
          wp: unknown,
        ): wp is Waypoint => // Jawne rzutowanie 'wp' na 'unknown' i następnie sprawdzanie typu
          typeof wp === "object" &&
          wp !== null &&
          "lat" in wp &&
          typeof (wp as Waypoint).lat === "number" &&
          "lon" in wp &&
          typeof (wp as Waypoint).lon === "number" &&
          "alt" in wp &&
          typeof (wp as Waypoint).alt === "number",
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid payload format. Expected an array of waypoints with lat, lon, and alt as numbers.",
        },
        { status: 400 },
      );
    }

    // Po walidacji, TypeScript wie, że rawWaypoints jest typu PostPayload
    const waypoints: PostPayload = rawWaypoints;

    // Wysłanie payloadu do zewnętrznego API
    const response = await fetch(
      "https://pi.newinfotech.org/add-mission-waypoints",
      {
        method: "POST", // Metoda POST
        headers: {
          "Content-Type": "application/json", // Nagłówek informujący o typie danych
        },
        body: JSON.stringify(waypoints), // Konwersja tablicy punktów na JSON
        cache: "no-store", // Wyłącza buforowanie
      },
    );

    if (!response.ok) {
      // Przekaż status i błąd z API, jeśli wystąpi problem
      const errorText = await response.text(); // Próbuj odczytać tekst błędu z odpowiedzi
      return NextResponse.json(
        {
          error: `Upstream HTTP ${response.status}: ${errorText || response.statusText}`,
        },
        { status: response.status },
      );
    }

    // Jeśli zewnętrzne API zwróci odpowiedź, przekaż ją dalej
    // Poprawka błędu: Bezpieczne przypisanie typu z `unknown` dla odpowiedzi
    const responseData: unknown = await response.json(); //
    return NextResponse.json(responseData);
  } catch (e) {
    console.error("Error processing waypoint upload:", e);
    // Obsługa błędów, np. jeśli request.json() zawiedzie (niepoprawny JSON) lub fetch rzuci błąd sieciowy
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
