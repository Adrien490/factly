import { PrismaClient } from "@prisma/client";

// Cache durations (in seconds)
export const CACHE_TIMES = {
	VERY_SHORT: 60, // 1 minute
	SHORT: 300, // 5 minutes
	MEDIUM: 1800, // 30 minutes
	LONG: 3600, // 1 hour
	VERY_LONG: 86400, // 24 hours
} as const;

// Database client configuration
const globalForPrisma = global as unknown as {
	prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (typeof window === "undefined") {
	if (!globalForPrisma.prisma) {
		globalForPrisma.prisma = prisma;
	}
}

export default prisma;
