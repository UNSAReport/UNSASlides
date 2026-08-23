import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as orgsSchema from "./schema/orgs";
import * as presentationsSchema from "./schema/presentations";
import * as tokensSchema from "./schema/tokens";
import * as usersSchema from "./schema/users";

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
