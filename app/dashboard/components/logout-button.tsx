"use client";

import logout from "@/api/auth/logout";
import { Button } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";

export default function LogoutButton() {
	return (
		<form action={logout}>
			<Button variant="ghost" type="submit">
				<LogOutIcon className="w-4 h-4" />
			</Button>
		</form>
	);
}
