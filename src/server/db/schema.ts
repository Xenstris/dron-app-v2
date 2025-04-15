// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { randomUUID } from "crypto";
import { sql } from "drizzle-orm";
import {
  geometry,
  pgTableCreator,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `dron-app-v2_${name}`);

export const locationSpot = createTable("location_spot", {
  id: varchar("id", { length: 254 })
    .primaryKey()
    .$default(() => randomUUID()),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  coordinates: geometry("location", {
    type: "point",
    mode: "xy",
    srid: 4326,
  }).notNull(),
});
