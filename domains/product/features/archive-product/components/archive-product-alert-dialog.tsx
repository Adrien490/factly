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
import { ArchiveProductButton } from "./archive-product-button";

interface ArchiveProductAlertDialogProps {
	name: string;
	id: string;
	children?: React.ReactNode;
}

export function ArchiveProductAlertDialog({
	name,
	id,
	children,
}: ArchiveProductAlertDialogProps) {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Archiver le produit</AlertDialogTitle>
					<AlertDialogDescription>
						Cette action va archiver le produit
						{name && <strong> {name}</strong>}.
						<br />
						Vous pourrez le restaurer ultérieurement.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Annuler</AlertDialogCancel>
					<ArchiveProductButton id={id}>
						<AlertDialogAction>Archiver</AlertDialogAction>
					</ArchiveProductButton>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
