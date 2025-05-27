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
import { DeleteMemberButton } from "./delete-member-button";

interface DeleteMemberAlertDialogProps {
	id: string;
	memberName?: string;
	children?: React.ReactNode;
}

export function DeleteMemberAlertDialog({
	id,
	memberName,
	children,
}: DeleteMemberAlertDialogProps) {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle className="text-destructive">
						Êtes-vous sûr de vouloir retirer ce membre de l&apos;organisation ?
					</AlertDialogTitle>
					<AlertDialogDescription>
						Cette action va retirer définitivement{" "}
						{memberName ? `"${memberName}"` : "ce membre"} de
						l&apos;organisation.
						<br />
						Le membre perdra l&apos;accès à toutes les fonctionnalités réservées
						aux membres.
						<br />
						Cette action est irréversible.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Annuler</AlertDialogCancel>
					<DeleteMemberButton id={id}>
						<AlertDialogAction>
							Retirer de l&apos;organisation
						</AlertDialogAction>
					</DeleteMemberButton>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
