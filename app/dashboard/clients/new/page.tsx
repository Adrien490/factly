import { PageHeader } from "../../components/page-header";
import ClientForm from "../components/client-form";

export default function NewClientPage() {
	return (
		<div className="flex flex-col gap-6">
			<PageHeader
				title="New client"
				description="Add a new client to your dashboard"
				breadcrumbItems={[
					{ label: "Dashboard", href: "/dashboard" },
					{ label: "Clients", href: "/dashboard/clients" },
					{ label: "New client", href: "/dashboard/clients/new" },
				]}
			/>
			<div className="w-full">
				<ClientForm />
			</div>
		</div>
	);
}
