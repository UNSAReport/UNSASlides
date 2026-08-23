import { createClient } from "@libsql/client";
import * as orgsSchema from "@unsa-slides/db/schema/orgs";
import * as presentationsSchema from "@unsa-slides/db/schema/presentations";
import * as tokensSchema from "@unsa-slides/db/schema/tokens";
import * as usersSchema from "@unsa-slides/db/schema/users";
import { drizzle } from "drizzle-orm/libsql";

const dbUrl = process.env.DATABASE_URL || "file:./local.db";
const dbAuthToken = process.env.DATABASE_AUTH_TOKEN;

const client = createClient({
  url: dbUrl,
  authToken: dbAuthToken,
});

export const db = drizzle(client, {
  schema: {
    ...usersSchema,
    ...orgsSchema,
    ...presentationsSchema,
    ...tokensSchema,
  },
});

export type DB = typeof db;
