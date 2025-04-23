import { getFiscalYear } from "@/domains/fiscal-year/features/get-fiscal-year";
import { UpdateFiscalYearForm } from "@/domains/fiscal-year/features/update-fiscal-year/components";
import NotFound from "../../../not-found";

type PageProps = {
	params: Promise<{
		organizationId: string;
		fiscalYearId: string;
	}>;
};

export default async function EditFiscalYearPage({ params }: PageProps) {
	const { organizationId, fiscalYearId } = await params;

	const fiscalYear = await getFiscalYear({ id: fiscalYearId, organizationId });

	if (!fiscalYear) {
		return <NotFound />;
	}

	return <UpdateFiscalYearForm fiscalYear={fiscalYear} />;
}
