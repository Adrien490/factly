import prisma from "@/lib/db";

export const getUserById = async (id: string) => {
	try {
		const user = await prisma.user.findUnique({
			where: { id },
			select: {
				id: true,
				email: true,
				name: true,
				image: true,
			},
		});
		return user;
	} catch {
		return null;
	}
};

export const getUserByEmail = async (email: string) => {
	try {
		const user = await prisma.user.findUnique({
			where: { email },
			select: {
				id: true,
				email: true,
				name: true,
				image: true,
			},
		});
		return user;
	} catch {
		return null;
	}
};
