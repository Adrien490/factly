import NotFound from "@/app/dashboard/[organizationId]/not-found";
import { FISCAL_YEAR_STATUSES } from "@/domains/fiscal-year/constants/fiscal-year-statuses";
import { HorizontalMenu } from "@/shared/components";
import { Badge } from "@/shared/components/ui/badge";
import { use } from "react";
import { GetFiscalYearReturn } from "../types";

interface FiscalYearHeaderProps {
	fiscalYearPromise: Promise<GetFiscalYearReturn>;
}

export function FiscalYearHeader({ fiscalYearPromise }: FiscalYearHeaderProps) {
	const fiscalYear = use(fiscalYearPromise);

	if (!fiscalYear) {
		return <NotFound />;
	}

	// Recherche du statut dans la liste des statuts prédéfinis
	const statusInfo = FISCAL_YEAR_STATUSES.find(
		(option) => option.value === fiscalYear.status
	);

	return (
		<div>
			<div className="flex flex-col gap-4">
				<div>
					<div className="flex flex-wrap items-center gap-3">
						<h2 className="text-2xl font-bold">{fiscalYear.name}</h2>
						<div className="flex items-center gap-2">
							<Badge
								variant="outline"
								style={{
									backgroundColor: `${statusInfo?.color}20`,
									color: statusInfo?.color,
									borderColor: statusInfo?.color,
								}}
							>
								{statusInfo?.label}
							</Badge>
							{fiscalYear.isCurrent && <Badge variant="outline">Courant</Badge>}
						</div>
					</div>

					<div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
						<div className="text-sm text-muted-foreground">
							ID: {fiscalYear.id}
						</div>
						<div className="text-sm text-muted-foreground">
							Période: {new Date(fiscalYear.startDate).toLocaleDateString()} -{" "}
							{new Date(fiscalYear.endDate).toLocaleDateString()}
						</div>
					</div>
				</div>

				<div className="flex flex-wrap gap-3">
					<HorizontalMenu
						items={[
							{
								title: "Détails",
								url: `/dashboard/${fiscalYear.organizationId}/fiscal-years/${fiscalYear.id}`,
							},
							{
								title: "Modifier",
								url: `/dashboard/${fiscalYear.organizationId}/fiscal-years/${fiscalYear.id}/edit`,
							},
						]}
					/>
				</div>
			</div>
		</div>
	);
}
