export const getSupplierNavigation = (organizationId: string) => [
	{
		label: "Liste des fournisseurs",
		href: `/dashboard/${organizationId}/suppliers`,
	},
	{
		label: "Nouveau fournisseur",
		href: `/dashboard/${organizationId}/suppliers/new`,
	},
];
