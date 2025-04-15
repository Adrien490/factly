import { EmptyState } from "@/shared/components";
import { Search } from "lucide-react";
import { use } from "react";
import { ClientDataTableProps } from "./types";

export function ClientDatatable({ clientsPromise }: ClientDataTableProps) {
	const response = use(clientsPromise);

	const { pagination, clients } = response;

	console.log(clients);
	console.log(pagination);

	if (clients.length === 0) {
		return (
			<div className="py-12" role="status" aria-live="polite">
				<EmptyState
					icon={<Search className="w-10 h-10" />}
					title="Aucune donnée trouvée"
					description="Aucune donnée ne correspond à vos critères de recherche."
					className="group-has-[[data-pending]]:animate-pulse"
				/>
			</div>
		);
	}

	return <div>ClientDatatable</div>;
}
