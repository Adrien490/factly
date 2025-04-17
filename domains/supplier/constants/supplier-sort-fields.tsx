import { Briefcase, Calendar, Store, Tag, Truck } from "lucide-react";

export const SUPPLIER_SORT_FIELDS = [
	{ label: "Nom", value: "name", icon: <Store className="h-4 w-4" /> },
	{
		label: "Référence",
		value: "reference",
		icon: <Tag className="h-4 w-4" />,
	},
	{
		label: "Type de fournisseur",
		value: "supplierType",
		icon: <Truck className="h-4 w-4" />,
	},
	{
		label: "Statut",
		value: "status",
		icon: <Briefcase className="h-4 w-4" />,
	},
	{
		label: "Date de création",
		value: "createdAt",
		icon: <Calendar className="h-4 w-4" />,
	},
];
