import { uploadFiles } from "@/lib/uploadFile";
import { api } from "@/trpc/server";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const coordinatesSchema = z.object({
  x: z.number(),
  y: z.number(),
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Pobieramy dane współrzędnych i sprawdzamy, czy są obecne
    const coordinatesField = formData.get("coordinates");
    if (!coordinatesField) {
      return NextResponse.json(
        { error: "No coordinates data" },
        { status: 400 },
      );
    }

    // Upewniamy się, że to string, nie plik
    if (typeof coordinatesField !== "string") {
      return NextResponse.json(
        { error: "Expected 'coordinates' to be a string" },
        { status: 400 },
      );
    }

    // Parsujemy tekst JSON do obiektu
    let parsedCoordinates: unknown;
    try {
      parsedCoordinates = JSON.parse(coordinatesField.toString());
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON format for coordinates" },
        { status: 400 },
      );
    }

    // Walidujemy parsowany obiekt przy pomocy Zod
    const result = coordinatesSchema.safeParse(parsedCoordinates);
    if (!result.success) {
      return NextResponse.json(
        { error: "Wrong format for coordinates" },
        { status: 400 },
      );
    }
    const coordinates = result.data;

    // Pobieramy pliki i filtrujemy tylko te, które są faktycznie instancjami File
    const rawFiles = formData.getAll("files");
    const files = rawFiles.filter((item): item is File => item instanceof File);

    const filesInfo = files.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
    }));

    //Insetujemy do bazy danych
    const data = await api.locationSpots.insertLocationSpot({ coordinates });

    // Insert files to bunny storage
    await uploadFiles({ files, path: `/drone/${data?.id}` });

    return NextResponse.json({
      coordinates,
      files: filesInfo,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
