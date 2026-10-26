import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { USERS } from "./lib/users";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                username: {},
                password: {},
            },

            async authorize(credentials) {
                const username = credentials?.username as string;
                const password = credentials?.password as string;

                const user = USERS.find(
                    (u) =>
                        u.username === username &&
                        u.password === password
                );

                return user ?? null;
            },
        }),
    ],

    secret: process.env.AUTH_SECRET,

    session: {
        strategy: "jwt",
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
            }

            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                (session.user as any).role = token.role;
            }

            return session;
        },
    },

    pages: {
        signIn: "/login",
    },
});