import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { locationSpot } from "@/server/db/schema";
import { z } from "zod";
import { desc, sql } from "drizzle-orm";

export const locationRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const data = await ctx.db
      .select()
      .from(locationSpot)
      .orderBy(desc(locationSpot.createdAt));

    return data;
  }),
  insertLocationSpot: publicProcedure
    .input(
      z.object({
        coordinates: z.object({
          x: z.number(),
          y: z.number(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { coordinates } = input;

      const [newLocation] = await ctx.db
        .insert(locationSpot)
        .values({
          coordinates: sql`ST_SetSRID(ST_MakePoint(${coordinates.x}, ${coordinates.y}), 4326)`,
        })
        .returning();

      return newLocation;
    }),
});
