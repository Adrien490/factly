import PageHeader from "@/components/page-header";
import getClient from "../../../server/get-client";
import AddressForm from "../components/address-form";

type Props = {
	params: Promise<{
		organizationId: string;
		clientId: string;
	}>;
};

export default async function NewClientPage({ params }: Props) {
	const resolvedParams = await params;
	const { organizationId, clientId } = resolvedParams;
	const client = await getClient({ organizationId, id: clientId });
	return (
		<div className="flex flex-col gap-6">
			<PageHeader
				title="Nouvelle adresse"
				description="Créez une nouvelle adresse en remplissant les informations ci-dessous"
				breadcrumbs={[
					{ label: "Dashboard", href: `/dashboard/${organizationId}` },
					{ label: "Clients", href: `/dashboard/${organizationId}/clients` },
					{
						label: client.name,
						href: `/dashboard/${organizationId}/clients/${clientId}`,
					},
					{
						label: "Adresses",
						href: `/dashboard/${organizationId}/clients/${clientId}/addresses`,
					},
					{
						label: "Nouvelle adresse",
						href: `/dashboard/${organizationId}/clients/${clientId}/addresses/new`,
					},
				]}
			/>
			<div className="w-full">
				<AddressForm />
			</div>
		</div>
	);
}
