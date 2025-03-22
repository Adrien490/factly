import Navbar from "@/app/(public)/components/navbar";
import { auth } from "@/features/auth/lib/auth";
import { headers } from "next/headers";
import { Suspense } from "react";
import { UserAvatarSkeleton } from "../dashboard/(layout)/components/header-skeleton";

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
