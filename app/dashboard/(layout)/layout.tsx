import { auth } from "@/domains/auth";
import { headers } from "next/headers";
import { Suspense } from "react";
import { Header, HeaderSkeleton } from "./components";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col min-h-screen">
			<Suspense fallback={<HeaderSkeleton />}>
				<Header
					userPromise={auth.api
						.getSession({ headers: await headers() })
						.then((session) => session?.user ?? null)}
				/>
			</Suspense>
			<div className="flex-1">{children}</div>
		</div>
	);
}
