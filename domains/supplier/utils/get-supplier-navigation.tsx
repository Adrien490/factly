export const getSupplierNavigation = (organizationId: string) => [
	{
		title: "Liste des fournisseurs",
		url: `/dashboard/${organizationId}/suppliers`,
	},
	{
		title: "Nouveau fournisseur",
		url: `/dashboard/${organizationId}/suppliers/new`,
	},
];
