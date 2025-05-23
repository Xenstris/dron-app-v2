import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { env } from "@/env";

export const googleMapsRouter = createTRPCRouter({
  getLocationByLatLong: publicProcedure
    .input(z.object({ latitude: z.number(), longitude: z.number() }))
    .query(async ({ input }) => {
      "use cache";
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${input.latitude},${input.longitude}&key=${env.GOOGLE_MAPS_API_KEY}`;
      const response = await fetch(url);
      const data = (await response.json()) as z.infer<typeof googleMapsSchema>;
      return data.results[0]?.formatted_address ?? null;
    }),
});

export const googleMapsSchema = z.object({
  results: z.array(
    z.object({
      address_components: z.array(
        z.object({
          long_name: z.string(),
          short_name: z.string(),
          types: z.array(z.string()),
        }),
      ),
      formatted_address: z.string(),
      geometry: z.object({
        location: z.object({ lat: z.number(), lng: z.number() }),
        location_type: z.string(),
        viewport: z.object({
          northeast: z.object({ lat: z.number(), lng: z.number() }),
          southwest: z.object({ lat: z.number(), lng: z.number() }),
        }),
      }),
      place_id: z.string(),
      types: z.array(z.string()),
    }),
  ),
});
