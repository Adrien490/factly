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
import { ArchiveClientButton } from "./archive-client-button";

interface ArchiveClientAlertDialogProps {
	organizationId: string;
	id: string;
	children?: React.ReactNode;
}

export function ArchiveClientAlertDialog({
	organizationId,
	id,
	children,
}: ArchiveClientAlertDialogProps) {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Archiver le client</AlertDialogTitle>
					<AlertDialogDescription>
						Cette action va archiver le client.
						<br />
						Vous pourrez le restaurer ultérieurement.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Annuler</AlertDialogCancel>
					<ArchiveClientButton organizationId={organizationId} id={id}>
						<AlertDialogAction>Archiver</AlertDialogAction>
					</ArchiveClientButton>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
