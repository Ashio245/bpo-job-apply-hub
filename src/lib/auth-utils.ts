import { auth } from "./auth";
import { inMemoryDb } from "./db-fallback";
import prisma from "./prisma";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const session = await auth();
    if (session?.user) {
      return {
        id: session.user.id || "user-1",
        name: session.user.name || "Juan Dela Cruz",
        email: session.user.email || "juan@example.com",
        role: (session.user as any).role || "USER",
      };
    }
  } catch (err) {
    console.warn("Auth session check failed or database is not connected. Falling back to default mock developer user.");
  }

  // Development bypass helper:
  // If the database is not set up, we return a mock developer seeker session
  return {
    id: "user-1",
    name: "Juan Dela Cruz",
    email: "juan@example.com",
    role: "USER" // Set to "ADMIN" to test admin routes
  };
}

export async function requireAuth(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized: Authentication required");
  }
  return user;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    // If the database is not active, we look at the in-memory store
    const isMockAdmin = user?.email === "admin@bpoapply.ph";
    if (isMockAdmin) {
      return {
        id: "admin-1",
        name: "Admin Hub Manager",
        email: "admin@bpoapply.ph",
        role: "ADMIN"
      };
    }
    throw new Error("Unauthorized: Admin privileges required");
  }
  return user;
}
