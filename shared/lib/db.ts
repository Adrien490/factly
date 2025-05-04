import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import { withOptimize } from "@prisma/extension-optimize";
const globalForPrisma = global as unknown as {
	prisma: PrismaClient;
};

const prisma =
	globalForPrisma.prisma ||
	new PrismaClient().$extends(withAccelerate()).$extends(
		withOptimize({
			apiKey: process.env.OPTIMIZE_API_KEY!,
		})
	);

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
