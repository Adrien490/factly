export const clientNavigation = (organizationId: string, clientId: string) => [
	{
		label: "Fiche client",
		href: `/dashboard/${organizationId}/clients/${clientId}`,
	},
	{
		label: "Modifier",
		href: `/dashboard/${organizationId}/clients/${clientId}/edit`,
	},
	{
		label: "Gestion des adresses",
		href: `/dashboard/${organizationId}/clients/${clientId}/addresses`,
	},
	{
		label: "Gestion des contacts",
		href: `/dashboard/${organizationId}/clients/${clientId}/contacts`,
	},
	{
		label: "Supprimer",
		href: `/dashboard/${organizationId}/clients/${clientId}/delete`,
	},
];
