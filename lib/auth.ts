import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "sqlite",
        schema: schema
    }),
    user: {
        additionalFields: {
            username: {
                type: "string",
                required: true,
            }
        }
    },
    socialProviders: {
        github: {
            clientId: process.env.GH_CLIENT_ID! as string,
            clientSecret: process.env.GH_CLIENT_SECRET! as string,
            mapProfileToUser: (profile) => {
                console.log(profile)
                return {
                    username: profile.login,
                }
            }
        }
    }
});