type MenuItem = {
	label: string;
	href?: string;
	icon?: React.ReactNode;
	disabled?: boolean;
	onClick?: () => void;
	items?: MenuItem[]; // Pour les sous-menus
};

export default MenuItem;
