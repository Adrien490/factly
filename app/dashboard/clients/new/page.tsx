import { PageHeader } from "../../components/page-header";

export default function NewClientPage() {
	return (
		<div className="flex flex-col gap-6">
			<PageHeader
				title="New client"
				breadcrumbItems={[
					{ label: "Dashboard", href: "/dashboard" },
					{ label: "Clients", href: "/dashboard/clients" },
					{ label: "New client", href: "/dashboard/clients/new" },
				]}
			/>
		</div>
	);
}
