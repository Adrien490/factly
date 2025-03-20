import AppShowcase from "@/app/(public)/components/app-showcase";
import Features from "@/app/(public)/components/features";
import Footer from "@/app/(public)/components/footer";
import Hero from "@/app/(public)/components/hero";

export default async function HomePage() {
	return (
		<>
			<Hero />
			<AppShowcase />
			<Features />
			{/* <Pricing /> */}
			<Footer />
		</>
	);
}
