import { Edit, FileText, MapPin, Trash2, Users } from "lucide-react";

/**
 * Items du menu dropdown de navigation pour un client
 */
export const getClientNavigation = (
	organizationId: string,
	clientId: string
) => [
	{
		label: "Fiche client",
		href: `/dashboard/${organizationId}/clients/${clientId}`,
		icon: <FileText className="h-4 w-4" />,
	},
	{
		label: "Modifier",
		href: `/dashboard/${organizationId}/clients/${clientId}/edit`,
		icon: <Edit className="h-4 w-4" />,
	},
	{
		label: "Gestion des adresses",
		href: `/dashboard/${organizationId}/clients/${clientId}/addresses`,
		icon: <MapPin className="h-4 w-4" />,
	},
	{
		label: "Gestion des contacts",
		href: `/dashboard/${organizationId}/clients/${clientId}/contacts`,
		icon: <Users className="h-4 w-4" />,
	},
	{
		label: "Supprimer",
		href: `/dashboard/${organizationId}/clients/${clientId}/delete`,
		icon: <Trash2 className="h-4 w-4" />,
		isSeparatorBefore: true,
	},
];
