export const GET_CONTACT_DEFAULT_SELECT = {
	id: true,
	firstName: true,
	lastName: true,
	civility: true,
	function: true,
	email: true,
	phoneNumber: true,
	mobileNumber: true,
	faxNumber: true,
	website: true,
	notes: true,
	isDefault: true,
	createdAt: true,
	updatedAt: true,
	clientId: true,
	supplierId: true,
	client: {
		select: {
			id: true,
			organizationId: true,
		},
	},
	supplier: {
		select: {
			id: true,
			organizationId: true,
		},
	},
} as const;
