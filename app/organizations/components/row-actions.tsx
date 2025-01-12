"use client";

import { MenuActions } from "@/components/menu-actions";
import { Organization } from "@prisma/client";
import { EyeIcon, PencilIcon } from "lucide-react";

type Props = {
	organization: Organization;
};

export default function RowActions({ organization }: Props) {
	return (
		<MenuActions
			actions={[
				{
					label: "Accéder au dashboard",
					href: `/dashboard/${organization.id}`,
					icon: <EyeIcon className="h-4 w-4" />,
				},
				{
					label: "Modifier",
					href: `/organizations/${organization.id}/edit`,
					icon: <PencilIcon className="h-4 w-4" />,
				},
			]}
		/>
	);
}
