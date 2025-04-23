export const getFiscalYearNavigation = (organizationId: string) => [
	{
		label: "Vue d'ensemble",
		href: `/dashboard/${organizationId}/fiscal-years`,
	},
	{
		label: "Nouvelle année fiscale",
		href: `/dashboard/${organizationId}/fiscal-years/new`,
	},
];
