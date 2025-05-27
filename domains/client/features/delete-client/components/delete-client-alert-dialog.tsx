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
import { DeleteClientButton } from "./delete-client-button";

interface DeleteClientAlertDialogProps {
	id: string;
	children?: React.ReactNode;
}

export function DeleteClientAlertDialog({
	id,
	children,
}: DeleteClientAlertDialogProps) {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle className="text-destructive">
						Êtes-vous sûr de vouloir supprimer définitivement ce client ?
					</AlertDialogTitle>
					<AlertDialogDescription>
						Cette action va supprimer définitivement le client.
						<br />
						Cette action est irréversible.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Annuler</AlertDialogCancel>
					<DeleteClientButton id={id}>
						<AlertDialogAction>Supprimer</AlertDialogAction>
					</DeleteClientButton>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
