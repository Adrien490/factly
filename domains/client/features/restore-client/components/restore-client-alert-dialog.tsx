import { ClientStatusOption } from "@/domains/client/constants";
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
import { UpdateClientStatusButton } from "../../update-client-status/components/udpate-client-status-button";

interface RestoreClientAlertDialogProps {
	status: ClientStatusOption;
	id: string;
	children?: React.ReactNode;
}

export function RestoreClientAlertDialog({
	status,
	id,
	children,
}: RestoreClientAlertDialogProps) {
	return (
		<AlertDialog key={status.value}>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Restaurer le client en {status.label.toLowerCase()}
					</AlertDialogTitle>
					<AlertDialogDescription>
						Cette action va restaurer le client en statut{" "}
						{status.label.toLowerCase()}.
						<br />
						Cette action est réversible.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Annuler</AlertDialogCancel>
					<UpdateClientStatusButton id={id} status={status.value}>
						<AlertDialogAction>Restaurer</AlertDialogAction>
					</UpdateClientStatusButton>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
