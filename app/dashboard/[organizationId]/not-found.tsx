"use client";

import { ErrorPage } from "@/shared/components/error-page";
import { FileQuestionIcon } from "lucide-react";

export default function NotFoundPage() {
	return (
		<ErrorPage
			icon={<FileQuestionIcon className="h-16 w-16 text-amber-500" />}
			title="Page introuvable"
			message="La page que vous recherchez n'existe pas ou a été déplacée."
		/>
	);
}
