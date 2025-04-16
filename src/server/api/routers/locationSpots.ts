import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { locationSpot } from "@/server/db/schema";
import { z } from "zod";
import { and, desc, gte, lte, sql } from "drizzle-orm";

export const locationRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z
        .object({
          from: z.string().datetime().optional(),
          to: z.string().datetime().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const where = [];

      if (input?.from) {
        where.push(gte(locationSpot.createdAt, new Date(input.from)));
      }

      if (input?.to) {
        const inclusiveTo = new Date(input.to);
        inclusiveTo.setHours(23, 59, 59, 999);
        where.push(lte(locationSpot.createdAt, inclusiveTo));
      }

      const data = await ctx.db
        .select()
        .from(locationSpot)
        .where(where.length ? and(...where) : undefined)
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
