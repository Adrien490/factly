import { Edit2, FileText, MapPin, Trash2, Users } from "lucide-react";

export interface ClientRowMenuItem {
	label: string;
	href: string;
	isDanger?: boolean;
	isSeparatorBefore?: boolean;
	icon?: React.ReactNode;
}

export const getClientRowMenuItems = (
	organizationId: string,
	clientId: string
): ClientRowMenuItem[] => [
	{
		label: "Fiche client",
		href: `/dashboard/${organizationId}/clients/${clientId}`,
		icon: <FileText className="h-4 w-4 mr-2" />,
	},
	{
		label: "Modifier",
		href: `/dashboard/${organizationId}/clients/${clientId}/edit`,
		isSeparatorBefore: true,
		icon: <Edit2 className="h-4 w-4 mr-2" />,
	},
	{
		label: "Contacts",
		href: `/dashboard/${organizationId}/clients/${clientId}/contacts`,
		icon: <Users className="h-4 w-4 mr-2" />,
	},
	{
		label: "Adresses",
		href: `/dashboard/${organizationId}/clients/${clientId}/addresses`,
		icon: <MapPin className="h-4 w-4 mr-2" />,
	},
	{
		label: "Supprimer",
		href: `/dashboard/${organizationId}/clients/${clientId}/delete`,
		isDanger: true,
		isSeparatorBefore: true,
		icon: <Trash2 className="h-4 w-4 mr-2" />,
	},
];
