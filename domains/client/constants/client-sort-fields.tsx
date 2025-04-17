import { Calendar, Tag, Users } from "lucide-react";

export const CLIENT_SORT_FIELDS = [
	{ label: "Nom", value: "name", icon: <Users className="h-4 w-4" /> },
	{
		label: "Référence",
		value: "reference",
		icon: <Tag className="h-4 w-4" />,
	},
	{
		label: "Date de création",
		value: "createdAt",
		icon: <Calendar className="h-4 w-4" />,
	},
];
