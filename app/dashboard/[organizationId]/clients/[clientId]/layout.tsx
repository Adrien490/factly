import { PageContainer } from "@/shared/components";

export default function ClientLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <PageContainer className="pt-4 pb-12">{children}</PageContainer>;
}
