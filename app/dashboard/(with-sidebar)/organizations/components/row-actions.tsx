"use client";

import { MenuActions } from "@/components/menu-actions";
import { Organization } from "@prisma/client";
import { EyeIcon, Settings } from "lucide-react";

type Props = {
	organization: Organization;
};

export default function RowActions({ organization }: Props) {
	return (
		<MenuActions
			actions={[
				{
					label: "Accéder au dashboard",
					href: `/dashboard/organization/${organization.id}`,
					icon: <EyeIcon className="h-4 w-4" />,
				},
				{
					label: "Paramètres",
					href: `/dashboard/organization/${organization.id}/settings`,
					icon: <Settings className="h-4 w-4" />,
				},
			]}
		/>
	);
}
