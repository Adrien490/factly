import { PrismaClient } from "@prisma/client";

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
