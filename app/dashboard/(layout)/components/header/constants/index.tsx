import { MenuItem } from "@/app/dashboard/(layout)/components/header/types";

const menuItems: MenuItem[] = [
	{
		label: "Mes organisations",
		href: "/dashboard",
	},

	{
		label: "Nouvelle organisation",
		href: "/dashboard/new",
	},
	/*{
		label: "Invitations",
		href: "/dashboard/invitations",
	},*/
];

export default menuItems;
