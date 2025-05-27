import { auth } from "@/domains/auth";
import { headers } from "next/headers";
import {
	createUploadthing,
	UploadThingError,
	type FileRouter,
} from "uploadthing/server";

const f = createUploadthing();

const getUser = async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	return session?.user;
};

// FileRouter pour vos fichiers uploadés
export const ourFileRouter = {
	companyLogo: f({
		image: {
			maxFileSize: "2MB",
			maxFileCount: 1,
			contentDisposition: "inline",
		},
	})
		.middleware(async () => {
			const user = await getUser();

			if (!user)
				throw new UploadThingError(
					"Vous devez être connecté pour télécharger un logo"
				);

			return { userId: user.id };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			console.log(
				"Upload de logo d'entreprise complété pour l'utilisateur:",
				metadata.userId
			);
			console.log("URL du fichier:", file.ufsUrl);

			return { url: file.ufsUrl };
		}),

	productImage: f({
		image: {
			maxFileSize: "2MB",
			maxFileCount: 1,
			contentDisposition: "inline",
		},
	})
		.middleware(async () => {
			const user = await getUser();

			if (!user)
				throw new UploadThingError(
					"Vous devez être connecté pour télécharger une image de produit"
				);

			return { userId: user.id };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			console.log(
				"Upload d'image de produit complété pour l'utilisateur:",
				metadata.userId
			);
			console.log("URL du fichier:", file.ufsUrl);

			return { url: file.ufsUrl };
		}),

	userAvatar: f({
		image: {
			maxFileSize: "2MB",
			maxFileCount: 1,
			contentDisposition: "inline",
		},
	})
		.middleware(async () => {
			const user = await getUser();

			if (!user)
				throw new UploadThingError(
					"Vous devez être connecté pour télécharger une photo de profil"
				);

			return { userId: user.id };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			console.log(
				"Upload de photo de profil complété pour l'utilisateur:",
				metadata.userId
			);
			console.log("URL du fichier:", file.ufsUrl);

			return { url: file.ufsUrl };
		}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
