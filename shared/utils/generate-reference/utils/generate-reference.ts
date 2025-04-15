import { GenerateReferenceProps } from "../types";

export async function generateReference({
	prefix = "CLI",
	format = "alphanumeric",
	length = 8,
	separator = "-",
}: GenerateReferenceProps = {}): Promise<string> {
	let uniquePart: string;

	switch (format) {
		case "numeric":
			// Generate a random numeric string
			uniquePart = Array.from({ length }, () =>
				Math.floor(Math.random() * 10)
			).join("");
			break;

		case "sequential":
			// Use timestamp for sequential ordering
			const timestamp = Date.now().toString(36).toUpperCase();
			uniquePart = timestamp.slice(-length).padStart(length, "0");
			break;

		case "alphanumeric":
		default:
			// Generate random alphanumeric string
			const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
			uniquePart = Array.from(
				{ length },
				() => chars[Math.floor(Math.random() * chars.length)]
			).join("");
			break;
	}

	// Add random suffix for extra uniqueness
	const randomSuffix = Math.floor(Math.random() * 1000)
		.toString()
		.padStart(3, "0");

	return [prefix, uniquePart, randomSuffix].filter(Boolean).join(separator);
}
