import { auth } from "@/domains/auth/lib/auth";
import { UserAvatarSkeleton } from "@/shared/components/user-avatar";
import { headers } from "next/headers";
import { Suspense } from "react";
import { Navbar } from "./components/navbar";

export default async function PublicLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<Suspense fallback={<UserAvatarSkeleton />}>
				<Navbar
					userPromise={auth.api
						.getSession({ headers: await headers() })
						.then((res) => res?.user ?? null)}
				/>
			</Suspense>
			{children}
		</>
	);
}
