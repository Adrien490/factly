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
import { SetDefaultContactButton } from "./set-default-contact-button";

interface SetDefaultContactAlertDialogProps {
	id: string;
	clientId?: string;
	supplierId?: string;
	children?: React.ReactNode;
}

export function SetDefaultContactAlertDialog({
	id,
	clientId,
	supplierId,
	children,
}: SetDefaultContactAlertDialogProps) {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Définir ce contact comme contact par défaut ?
					</AlertDialogTitle>
					<AlertDialogDescription>
						Ce contact sera utilisé par défaut pour les nouvelles opérations.
						<br />
						Vous pourrez toujours changer le contact par défaut ultérieurement.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Annuler</AlertDialogCancel>
					<SetDefaultContactButton
						id={id}
						clientId={clientId}
						supplierId={supplierId}
					>
						<AlertDialogAction>Définir par défaut</AlertDialogAction>
					</SetDefaultContactButton>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
