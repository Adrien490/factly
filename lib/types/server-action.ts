// types/server-action.ts
import { z } from "zod";

export const ServerActionStatus = {
	SUCCESS: "success",
	ERROR: "error",
	UNAUTHORIZED: "unauthorized",
	VALIDATION_ERROR: "validation_error",
} as const;

export type ServerActionStatus =
	(typeof ServerActionStatus)[keyof typeof ServerActionStatus];

export type ServerActionState<TData = void, TInput = void> = {
	status: ServerActionStatus;
	message: string;
	data?: TData;
	errors?: z.inferFlattenedErrors<z.ZodType<TInput>>["fieldErrors"];
	inputs?: Partial<TInput>;
};

export type ServerAction<TData = void, TInput = void> = (
	state: ServerActionState<TData, TInput> | null,
	formData: FormData
) => Promise<ServerActionState<TData, TInput>>;
