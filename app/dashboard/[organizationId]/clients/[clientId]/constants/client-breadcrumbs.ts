export const clientBreadcrumbs = (organizationId: string, clientId: string) => [
	{
		label: "Clients",
		href: `/dashboard/${organizationId}/clients`,
	},
	{
		label: "Fiche client",
		href: `/dashboard/${organizationId}/clients/${clientId}`,
	},
];
