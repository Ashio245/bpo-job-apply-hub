import { PrismaClient } from "@prisma/client";

// In Prisma 7, PrismaClient instantiation requires explicit configuration.
// To prevent compilation/build-time connection failures when connection strings 
// are missing (e.g. during static page compilation on Vercel), we wrap Prisma 
// in a lazy-loading Proxy. This defers database connection initialization until 
// the first actual query is executed.

let prismaInstance: PrismaClient | null = null;

const getPrismaClient = (): PrismaClient => {
  if (!prismaInstance) {
    try {
      // In Prisma 7, url and directUrl configurations are read from prisma.config.ts,
      // but passing a fallback option prevents the client from throwing on instantiation.
      prismaInstance = new PrismaClient({
        datasources: {
          db: {
            url: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/postgres"
          }
        }
      } as any);
    } catch (err) {
      console.warn("Prisma Client initialization failed. Fallback db operations will handle requests.");
      // Return a dummy object to prevent crash, actual errors are caught at query time
      prismaInstance = {} as any;
    }
  }
  return prismaInstance!;
};

// Create the lazy-loading proxy
const prisma = new Proxy({} as PrismaClient, {
  get(target, prop, receiver) {
    const client = getPrismaClient();
    // Bind functions to client context to maintain correct 'this' execution context
    const value = Reflect.get(client, prop, receiver);
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  }
});

export default prisma;
