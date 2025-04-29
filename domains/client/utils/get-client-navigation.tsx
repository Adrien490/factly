export const getClientNavigation = (organizationId: string) => [
	{
		label: "Liste des clients",
		href: `/dashboard/${organizationId}/clients`,
	},
	{
		label: "Nouveau client",
		href: `/dashboard/${organizationId}/clients/new`,
	},
];
