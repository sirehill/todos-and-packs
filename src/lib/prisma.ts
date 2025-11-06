import { PrismaClient } from '@prisma/client';

// Lazily instantiate PrismaClient to avoid touching DATABASE_URL during import (e.g., Vercel build)
type GlobalWithPrisma = typeof globalThis & { _prisma?: PrismaClient };
const g = globalThis as GlobalWithPrisma;

let client: PrismaClient | undefined = g._prisma;

function getClient(): PrismaClient {
  if (!client) {
    client = new PrismaClient({ log: ['error', 'warn'] });
    if (process.env.NODE_ENV !== 'production') {
      g._prisma = client;
    }
  }
  return client;
}

// Export a proxy that defers PrismaClient creation until first property access
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop, _receiver) {
    const c = getClient() as any;
    const val = c[prop];
    return typeof val === 'function' ? val.bind(c) : val;
  },
}) as PrismaClient;

export default prisma;
