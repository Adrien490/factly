import Link from "next/link";
import MagicLinkForm from "./components/magic-link-form";
import Socials from "./components/socials";

export default async function LoginPage() {
	return (
		<div className="flex items-center justify-center px-4 py-12 min-h-screen border-4 mx-auto">
			<div className="max-w-xs">
				<div className="mb-8">
					<h1 className="text-2xl font-semibold tracking-tight">
						Bring your projects to life.
					</h1>

					<p className="text-xl text-muted-foreground">
						Sign in to your Factly account
					</p>
				</div>
				<div className="border-b border-muted pb-4 mb-6">
					<Socials />
				</div>
				<div className="">
					<MagicLinkForm />
				</div>

				<p className="text-muted-foreground text-sm text-center mt-8">
					By continuing, you agree to our{" "}
					<Link
						href="#"
						className="text-neutral-500 dark:text-neutral-300 hover:underline"
					>
						Terms of Service
					</Link>{" "}
					and{" "}
					<Link
						href="#"
						className="text-neutral-500 dark:text-neutral-300 hover:underline"
					>
						Privacy Policy
					</Link>
				</p>
			</div>
		</div>
	);
}
