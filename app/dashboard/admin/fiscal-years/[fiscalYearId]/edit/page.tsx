import NotFound from "@/app/not-found";
import { getFiscalYear } from "@/domains/fiscal-year/features/get-fiscal-year";
import { UpdateFiscalYearForm } from "@/domains/fiscal-year/features/update-fiscal-year/components";

type PageProps = {
	params: Promise<{
		fiscalYearId: string;
	}>;
};

export default async function EditFiscalYearPage({ params }: PageProps) {
	const { fiscalYearId } = await params;

	const fiscalYear = await getFiscalYear({ id: fiscalYearId });

	if (!fiscalYear) {
		return <NotFound />;
	}

	return <UpdateFiscalYearForm fiscalYear={fiscalYear} />;
}
