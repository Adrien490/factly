import { cn } from "@/shared/utils";
import { HeroBackground } from "./components/hero-background";
import { HeroContent } from "./components/hero-content";

export function Hero() {
	return (
		<HeroBackground>
			<div
				className={cn(
					"flex items-center justify-center w-full min-h-[100vh]",
					"mask-t-from-95% mask-t-to-98% mask-b-from-95% mask-b-to-98% sm:mask-t-from-90% sm:mask-t-to-97% sm:mask-b-from-90% sm:mask-b-to-97% md:mask-t-from-85% md:mask-t-to-97% md:mask-b-from-85% md:mask-b-to-97% lg:mask-t-from-80% lg:mask-t-to-99% lg:mask-b-from-80% lg:mask-b-to-99%"
				)}
			>
				<HeroContent />
			</div>
		</HeroBackground>
	);
}
