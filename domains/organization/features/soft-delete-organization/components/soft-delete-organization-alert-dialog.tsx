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
import { SoftDeleteOrganizationButton } from "./soft-delete-organization-button";

interface SoftDeleteOrganizationAlertDialogProps {
	id: string;
	children?: React.ReactNode;
}

export function SoftDeleteOrganizationAlertDialog({
	id,
	children,
}: SoftDeleteOrganizationAlertDialogProps) {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Supprimer l&apos;organisation</AlertDialogTitle>
					<AlertDialogDescription>
						Cette action va supprimer l&apos;organisation.
						<br />
						Cette action est irréversible.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Annuler</AlertDialogCancel>
					<SoftDeleteOrganizationButton id={id}>
						<AlertDialogAction>Supprimer</AlertDialogAction>
					</SoftDeleteOrganizationButton>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
