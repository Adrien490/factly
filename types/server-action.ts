// types/server-action.ts
import { z } from "zod";

export enum ServerActionStatus {
	SUCCESS = "success",
	ERROR = "error",
	UNAUTHORIZED = "unauthorized",
	VALIDATION_ERROR = "validation_error",
	NOT_FOUND = "not_found",
	CONFLICT = "conflict",
	FORBIDDEN = "forbidden",
	PENDING = "pending",
}

export type ServerResponse<T> = {
	status: ServerActionStatus;
	message: string;
	data?: T;
};

export type ValidationErrors<T> = {
	[K in keyof T]?: string[];
};

export type ServerActionState<T, S extends z.ZodType> = ServerResponse<T> & {
	validationErrors?: ValidationErrors<z.infer<S>>;
	formData?: z.infer<S>;
};

export function createSuccessResponse<T, S extends z.ZodType>(
	data: T,
	message: string
): ServerActionState<T, S> {
	return {
		status: ServerActionStatus.SUCCESS,
		message,
		data,
	};
}

export function createErrorResponse<T, S extends z.ZodType>(
	status: ServerActionStatus,
	message: string
): ServerActionState<T, S> {
	return {
		status,
		message,
	};
}

export function createValidationErrorResponse<T, S extends z.ZodType>(
	validationErrors: ValidationErrors<z.infer<S>>,
	formData: z.infer<S>,
	message: string
): ServerActionState<T, S> {
	return {
		status: ServerActionStatus.VALIDATION_ERROR,
		message,
		validationErrors,
		formData,
	};
}
