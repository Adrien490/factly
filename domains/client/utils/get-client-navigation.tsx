export const getClientNavigation = (organizationId: string) => [
	{
		title: "Liste des clients",
		url: `/dashboard/${organizationId}/clients`,
	},
	{
		title: "Nouveau client",
		url: `/dashboard/${organizationId}/clients/new`,
	},
];
