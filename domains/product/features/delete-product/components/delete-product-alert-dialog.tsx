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
import { DeleteProductButton } from "./delete-product-button";

interface DeleteProductAlertDialogProps {
	name: string;
	organizationId: string;
	id: string;
	children?: React.ReactNode;
}

export function DeleteProductAlertDialog({
	name,
	organizationId,
	id,
	children,
}: DeleteProductAlertDialogProps) {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle className="text-destructive">
						Êtes-vous sûr de vouloir supprimer définitivement ce produit ?
					</AlertDialogTitle>
					<AlertDialogDescription>
						Cette action va supprimer définitivement le produit
						{name && <strong> {name}</strong>}.
						<br />
						Cette action est irréversible.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Annuler</AlertDialogCancel>
					<DeleteProductButton organizationId={organizationId} id={id}>
						<AlertDialogAction>Supprimer</AlertDialogAction>
					</DeleteProductButton>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
