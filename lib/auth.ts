import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "./db";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "./utils";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "customer" | "admin" | "team";
      email: string;
      name: string;
    } & DefaultSession["user"];
  }
  interface User {
    role?: "customer" | "admin" | "team";
  }
}

const credsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET ?? "dev-secret-do-not-use-in-production",
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Credentials({
      name: "Email & password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(raw) {
        const parsed = credsSchema.safeParse(raw);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;

        const user = await db.query.users.findFirst({
          where: eq(users.email, email.toLowerCase()),
        });
        if (!user || !user.passwordHash) return null;
        if (user.status !== "active") return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        (token as Record<string, unknown>).uid = (user as { id?: string }).id;
        (token as Record<string, unknown>).role =
          (user as { role?: "customer" | "admin" | "team" }).role ?? "customer";
      }
      return token;
    },
    async session({ session, token }) {
      const t = token as Record<string, unknown>;
      if (t.uid && session.user) {
        session.user.id = String(t.uid);
        session.user.role = (t.role as "customer" | "admin" | "team") ?? "customer";
      }
      return session;
    },
    authorized({ auth, request }) {
      const url = new URL(request.url);
      const path = url.pathname;

      const isAdminRoute = path.startsWith("/admin");
      const isCustomerRoute =
        path.startsWith("/dashboard") ||
        path.startsWith("/bookings") ||
        path.startsWith("/profile");

      if (!auth) {
        if (isAdminRoute || isCustomerRoute) return false;
        return true;
      }

      if (isAdminRoute && auth.user.role !== "admin") return false;
      return true;
    },
  },
});

/** Server-side helpers */
export async function requireUser() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session.user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "admin") throw new Error("Forbidden");
  return user;
}

export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

/** Generate secure random token */
export function generateSecureToken(len = 40) {
  return nanoid(len);
}
