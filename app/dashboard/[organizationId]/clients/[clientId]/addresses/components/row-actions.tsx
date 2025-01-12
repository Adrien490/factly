"use client";

import { MenuActions } from "@/components/menu-actions";
import { Address } from "@prisma/client";
import { EyeIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { useParams } from "next/navigation";
import { useActionState, useTransition } from "react";
import deleteAddress from "../server/delete-address";

type Props = {
	address: Address;
};

export default function RowActions({ address }: Props) {
	const [isPending, startTransition] = useTransition();
	const [state, action] = useActionState(deleteAddress, null);
	const { organizationId, clientId } = useParams();

	const handleDelete = () => {
		const formData = new FormData();
		formData.append("id", address.id);
		formData.append("clientId", address.clientId);
		formData.append("organizationId", organizationId as string);
		startTransition(() => {
			action(formData);
		});
	};

	return (
		<MenuActions
			actions={[
				{
					label: "Voir",
					href: `/dashboard/${organizationId}/clients/${clientId}/addresses/${address.id}`,
					icon: <EyeIcon className="h-4 w-4" />,
				},
				{
					label: "Modifier",
					href: `/dashboard/${organizationId}/clients/${clientId}/addresses/${address.id}/edit`,
					icon: <PencilIcon className="h-4 w-4" />,
				},
				{
					label: "Supprimer",
					onClick: handleDelete,
					icon: <Trash2Icon className="h-4 w-4" />,
					variant: "destructive",
					disabled: isPending || state?.status === "pending",
				},
			]}
		/>
	);
}
