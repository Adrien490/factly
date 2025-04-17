import { Edit2, FileText, MapPin, Trash2, Users } from "lucide-react";

export interface SupplierRowMenuItem {
	label: string;
	href: string;
	isDanger?: boolean;
	isSeparatorBefore?: boolean;
	icon?: React.ReactNode;
}

export const getSupplierRowMenuItems = (
	organizationId: string,
	supplierId: string
): SupplierRowMenuItem[] => [
	{
		label: "Fiche fournisseur",
		href: `/dashboard/${organizationId}/suppliers/${supplierId}`,
		icon: <FileText className="h-4 w-4 mr-2" />,
	},
	{
		label: "Modifier",
		href: `/dashboard/${organizationId}/suppliers/${supplierId}/edit`,
		isSeparatorBefore: true,
		icon: <Edit2 className="h-4 w-4 mr-2" />,
	},
	{
		label: "Contacts",
		href: `/dashboard/${organizationId}/suppliers/${supplierId}/contacts`,
		icon: <Users className="h-4 w-4 mr-2" />,
	},
	{
		label: "Adresses",
		href: `/dashboard/${organizationId}/suppliers/${supplierId}/addresses`,
		icon: <MapPin className="h-4 w-4 mr-2" />,
	},
	{
		label: "Supprimer",
		href: `/dashboard/${organizationId}/suppliers/${supplierId}/delete`,
		isDanger: true,
		isSeparatorBefore: true,
		icon: <Trash2 className="h-4 w-4 mr-2" />,
	},
];
