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
import { DeleteContactButton } from "./delete-contact-button";

interface DeleteContactAlertDialogProps {
	organizationId: string;
	id: string;
	clientId?: string;
	supplierId?: string;
	children?: React.ReactNode;
}

export function DeleteContactAlertDialog({
	organizationId,
	id,
	clientId,
	supplierId,
	children,
}: DeleteContactAlertDialogProps) {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle className="text-destructive">
						Êtes-vous sûr de vouloir supprimer définitivement ce contact ?
					</AlertDialogTitle>
					<AlertDialogDescription>
						Cette action va supprimer définitivement le contact.
						<br />
						Cette action est irréversible.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Annuler</AlertDialogCancel>
					<DeleteContactButton
						organizationId={organizationId}
						id={id}
						clientId={clientId}
						supplierId={supplierId}
					>
						<AlertDialogAction>Supprimer</AlertDialogAction>
					</DeleteContactButton>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
