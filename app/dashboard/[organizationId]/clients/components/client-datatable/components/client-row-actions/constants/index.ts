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
		label: "Fiche client",
		href: `/dashboard/${organizationId}/clients/${clientId}`,
	},
	{
		label: "Modifier",
		href: `/dashboard/${organizationId}/clients/${clientId}/edit`,
		isSeparatorBefore: true,
	},
	{
		label: "Contacts",
		href: `/dashboard/${organizationId}/clients/${clientId}/contacts`,
	},
	{
		label: "Adresses",
		href: `/dashboard/${organizationId}/clients/${clientId}/addresses`,
	},
	{
		label: "Supprimer",
		href: `/dashboard/${organizationId}/clients/${clientId}/delete`,
		isDanger: true,
		isSeparatorBefore: true,
	},
];
