export interface ClientRowMenuItem {
	label: string;
	href: string;
	isDanger?: boolean;
	isSeparatorBefore?: boolean;
}

export const getClientRowMenuItems = (
	organizationId: string,
	clientId: string
): ClientRowMenuItem[] => [
	{
		label: "Voir la fiche client",
		href: `/dashboard/${organizationId}/clients/${clientId}`,
	},
	{
		label: "Modifier",
		href: `/dashboard/${organizationId}/clients/${clientId}/edit`,
		isSeparatorBefore: true,
	},
	{
		label: "Gestion des contacts",
		href: `/dashboard/${organizationId}/clients/${clientId}/contacts`,
	},
	{
		label: "Gestion des adresses",
		href: `/dashboard/${organizationId}/clients/${clientId}/addresses`,
	},
	{
		label: "Supprimer",
		href: `/dashboard/${organizationId}/clients/${clientId}/delete`,
		isDanger: true,
		isSeparatorBefore: true,
	},
];
