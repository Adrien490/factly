"use client";

import { cn } from "@/shared/utils";
import { useRouter } from "next/navigation";
import { authClient } from "../../lib";

interface LogoutButtonProps {
	className?: string;
	children: React.ReactNode;
}

export function LogoutButton({ className, children }: LogoutButtonProps) {
	const router = useRouter();
	const onLogout = async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					router.push("/login");
				},
			},
		});
	};
	return (
		<span onClick={onLogout} className={cn(className)}>
			{children}
		</span>
	);
}
