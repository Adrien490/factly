import { AnyFieldApi } from "@tanstack/react-form";

type Props = {
	field: AnyFieldApi;
};

export function FieldInfo({ field }: Props) {
	return (
		<>
			{field.state.meta.isTouched && field.state.meta.errors.length ? (
				<em className="text-xs text-destructive">
					{field.state.meta.errors.join(", ")}
				</em>
			) : null}
			{field.state.meta.isValidating ? <></> : null}
		</>
	);
}
