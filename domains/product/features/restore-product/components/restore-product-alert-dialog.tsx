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
import { ProductStatus } from "@prisma/client";
import { RestoreProductButton } from "./restore-product-button";

interface ProductStatusOption {
	value: ProductStatus;
	label: string;
}

interface RestoreProductAlertDialogProps {
	status: ProductStatusOption;
	name: string;
	id: string;
	children?: React.ReactNode;
}

export function RestoreProductAlertDialog({
	status,
	name,
	id,
	children,
}: RestoreProductAlertDialogProps) {
	return (
		<AlertDialog key={status.value}>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Restaurer le produit en {status.label.toLowerCase()}
					</AlertDialogTitle>
					<AlertDialogDescription>
						Cette action va restaurer le produit
						{name && <strong> {name}</strong>} en statut{" "}
						{status.label.toLowerCase()}.
						<br />
						Cette action est réversible.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Annuler</AlertDialogCancel>
					<RestoreProductButton id={id} status={status.value}>
						<AlertDialogAction>Restaurer</AlertDialogAction>
					</RestoreProductButton>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
