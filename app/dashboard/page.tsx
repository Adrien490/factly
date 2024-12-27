import { auth } from "@/auth";
import LogoutButton from "./components/logout-button";

export default async function DashboardPage() {
	const session = await auth();

	return (
		<div>
			Dashboard
			{JSON.stringify(session)}
			<LogoutButton />
		</div>
	);
}
