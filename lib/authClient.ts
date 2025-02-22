import { createAuthClient } from "better-auth/react";
import type { auth } from "./auth";
import { inferAdditionalFields } from "better-auth/client/plugins";

const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL!,
    plugins: [inferAdditionalFields<typeof auth>()]
});

export const {
    signIn,
    signOut,
    signUp,
    useSession
} = authClient;