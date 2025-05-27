import { DotsLoader } from "@/shared/components";
import { Button, FormLabel } from "@/shared/components/ui";
import { UploadDropzone } from "@/shared/lib/uploadthing";
import Image from "next/image";
import { toast } from "sonner";
import { FieldInfo } from "..";
import { useFieldContext } from "../../lib/form-context";

interface UploadFieldProps {
	disabled?: boolean;
	label?: string;
	onChange?: (files: File[]) => void;
	required?: boolean;
	endpoint: "companyLogo" | "productImage" | "userAvatar";
	previewSize?: "sm" | "md" | "lg";
	accept?: string;
	maxSize?: string;
	onUploadError?: (error: Error) => void;
	isUploading?: boolean;
}

export const UploadField = ({
	disabled,
	label,
	required,
	endpoint,
	previewSize = "md",
	accept,
	maxSize,
	onUploadError,
	onChange,
	isUploading,
}: UploadFieldProps) => {
	const field = useFieldContext<string>();
	const imageUrl = field.state.value;

	const previewSizes = {
		sm: "h-8 w-8",
		md: "h-24 w-24",
		lg: "h-32 w-32",
	};

	return (
		<div className="space-y-3">
			<div className="flex items-center justify-between">
				<FormLabel className="text-base flex items-center">
					{label}
					{required && <span className="text-destructive ml-1">*</span>}
				</FormLabel>
				{imageUrl && (
					<Button
						disabled={disabled}
						type="button"
						variant="ghost"
						size="sm"
						className="text-destructive"
						onClick={() => field.handleChange("")}
					>
						Supprimer
					</Button>
				)}
			</div>

			{imageUrl ? (
				<div className="flex items-center justify-center">
					<div
						className={`relative ${previewSizes[previewSize]} rounded-md overflow-hidden`}
					>
						<Image
							src={imageUrl}
							alt={`${label || "Image"}`}
							fill
							sizes={`${previewSize === "sm" ? "32px" : previewSize === "md" ? "96px" : "128px"}`}
							className="object-cover"
							priority
						/>
					</div>
				</div>
			) : (
				<div className="relative">
					<UploadDropzone
						endpoint={endpoint}
						onChange={onChange}
						onUploadError={(error) => {
							console.error(error);
							toast.error("Erreur lors de l'upload", {
								description:
									"Impossible de charger l'image. Veuillez réessayer.",
							});
							onUploadError?.(error);
						}}
						className="border-2 border-dashed border-muted-foreground/25 h-44 rounded-lg bg-muted/5 hover:bg-muted/10 transition-all duration-300 ut-label:text-sm ut-allowed-content:hidden hover:border-primary/30 ut-container:cursor-pointer ut-button:bg-primary ut-button:hover:bg-primary/90"
					/>

					{isUploading && (
						<div className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-[2px] rounded-lg transition-all duration-300">
							<div className="flex items-center gap-3 flex-col">
								<DotsLoader color="primary" size="xs" />
							</div>
						</div>
					)}
				</div>
			)}
			<p className="text-xs text-muted-foreground mt-2">
				{accept && `Formats acceptés: ${accept}. `}
				{maxSize && `Max. ${maxSize}.`}
			</p>
			<FieldInfo field={field} />
		</div>
	);
};
