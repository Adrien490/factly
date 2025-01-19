import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
	// Route pour l'upload d'images
	imageUploader: f({
		image: {
			maxFileSize: "4MB",
			maxFileCount: 1,
		},
	})
		.middleware(async () => {
			// Vérification de l'authentification
			const session = await auth.api.getSession({
				headers: await headers(),
			});
			if (!session?.user) throw new UploadThingError("Non autorisé");

			return { userId: session.user.id };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			console.log("Upload terminé pour userId:", metadata.userId);
			console.log("URL du fichier:", file.url);

			return { uploadedBy: metadata.userId };
		}),

	// Route pour l'upload de logos d'organisation
	organizationLogo: f({
		image: {
			maxFileSize: "2MB",
			maxFileCount: 1,
		},
	})
		.middleware(async () => {
			const session = await auth.api.getSession({
				headers: await headers(),
			});
			if (!session?.user) throw new UploadThingError("Non autorisé");

			return { userId: session.user.id };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			console.log("Logo uploadé pour userId:", metadata.userId);
			console.log("URL du logo:", file.url);

			return { uploadedBy: metadata.userId };
		}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
