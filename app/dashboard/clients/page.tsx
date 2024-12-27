import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PageHeader } from "../components/page-header";
import SearchForm from "../components/search-form";

export default function ClientsPage() {
	return (
		<div className="flex flex-col gap-6">
			<PageHeader
				title="Clients"
				breadcrumbItems={[
					{ label: "Dashboard", href: "/dashboard" },
					{ label: "Clients", href: "/dashboard/clients" },
				]}
				actions={
					<>
						<SearchForm paramName="search" placeholder="Search clients..." />
						<Link href="/dashboard/clients/new">
							<Button>Add client</Button>
						</Link>
					</>
				}
			/>

			<div className=""></div>
		</div>
	);
}
