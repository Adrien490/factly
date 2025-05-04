"use client";

import { fieldContext, formContext } from "@/shared/lib/form-context";
import { createFormHook } from "@tanstack/react-form";
import { CheckboxField } from "./checkbox-field";
import { InputField } from "./input-field";
import { SelectField } from "./select-field";
import { TextareaField } from "./textarea-field";

export { FieldInfo } from "./field-info";
export { FormErrors } from "./form-errors";
export { FormFooter } from "./form-footer";
export { FormLayout } from "./form-layout";
export { FormSection } from "./form-section";

export const { useAppForm } = createFormHook({
	fieldContext,
	formContext,
	fieldComponents: {
		InputField,
		SelectField,
		CheckboxField,
		TextareaField,
	},
	formComponents: {},
});
