import NotFound from "@/app/not-found";
import {
	FISCAL_YEAR_STATUS_COLORS,
	FISCAL_YEAR_STATUS_LABELS,
} from "@/domains/fiscal-year/constants";
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
									backgroundColor: `${FISCAL_YEAR_STATUS_COLORS[fiscalYear.status]}20`,
									color: FISCAL_YEAR_STATUS_COLORS[fiscalYear.status],
									borderColor: FISCAL_YEAR_STATUS_COLORS[fiscalYear.status],
								}}
							>
								{FISCAL_YEAR_STATUS_LABELS[fiscalYear.status]}
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
			</div>
		</div>
	);
}
