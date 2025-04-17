import {
	BarChart,
	Edit,
	FileText,
	Mail,
	MapPin,
	Phone,
	Trash2,
	Users,
} from "lucide-react";

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
		label: "Communications",
		href: `/dashboard/${organizationId}/clients/${clientId}/communications`,
		icon: <Mail className="h-4 w-4" />,
		isSeparatorBefore: true,
	},
	{
		label: "Appels",
		href: `/dashboard/${organizationId}/clients/${clientId}/calls`,
		icon: <Phone className="h-4 w-4" />,
	},
	{
		label: "Statistiques",
		href: `/dashboard/${organizationId}/clients/${clientId}/statistics`,
		icon: <BarChart className="h-4 w-4" />,
		isSeparatorBefore: true,
	},
	{
		label: "Supprimer",
		href: `/dashboard/${organizationId}/clients/${clientId}/delete`,
		icon: <Trash2 className="h-4 w-4" />,
		isSeparatorBefore: true,
	},
];
