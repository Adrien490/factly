import { AppShowcase, Features, Footer, Hero } from "./components";

export default async function HomePage() {
	"use cache";

	return (
		<>
			<Hero />
			<AppShowcase />
			<Features />
			<Footer />
		</>
	);
}
