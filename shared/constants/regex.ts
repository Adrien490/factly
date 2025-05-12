/**
 * Expressions régulières utilisées dans l'application
 */

export const PHONE_REGEX = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
export const MOBILE_REGEX = /^(?:(?:\+|00)33|0)\s*[67](?:[\s.-]*\d{2}){4}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const URL_REGEX =
	/^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
export const NAF_APE_REGEX = /^\d{4}[A-Z]$/;
export const SIREN_REGEX = /^\d{9}$/;
export const SIRET_REGEX = /^\d{14}$/;
export const VAT_NUMBER_REGEX = /^FR\d{2}\d{9}$/;
