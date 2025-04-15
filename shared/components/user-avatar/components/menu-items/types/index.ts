import { User } from "better-auth";

export interface MenuItemsProps {
	user: User;
	onLogout: () => void;
}
