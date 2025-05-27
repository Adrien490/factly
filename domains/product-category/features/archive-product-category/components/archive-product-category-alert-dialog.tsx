"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/shared/components";
import { ArchiveProductCategoryButton } from "./archive-product-category-button";

interface ArchiveProductCategoryAlertDialogProps {
	name: string;
	id: string;
	children?: React.ReactNode;
}

export function ArchiveProductCategoryAlertDialog({
	name,
	id,
	children,
}: ArchiveProductCategoryAlertDialogProps) {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Archiver la catégorie</AlertDialogTitle>
					<AlertDialogDescription>
						Cette action va archiver la catégorie
						{name && <strong> {name}</strong>}.
						<br />
						Les produits associés à cette catégorie resteront inchangés.
						<br />
						Vous pourrez la restaurer ultérieurement.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Annuler</AlertDialogCancel>
					<ArchiveProductCategoryButton id={id}>
						<AlertDialogAction>Archiver</AlertDialogAction>
					</ArchiveProductCategoryButton>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
