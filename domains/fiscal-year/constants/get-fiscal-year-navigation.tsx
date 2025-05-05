export const getFiscalYearNavigation = (organizationId: string) => [
	{
		title: "Vue d'ensemble",
		url: `/dashboard/${organizationId}/fiscal-years`,
	},
	{
		title: "Nouvelle année fiscale",
		url: `/dashboard/${organizationId}/fiscal-years/new`,
	},
];
