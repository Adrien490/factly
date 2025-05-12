import { EmployeeCount } from "@prisma/client";

export type EmployeeCountType = {
	value: EmployeeCount;
	label: string;
};

export const EMPLOYEE_COUNT_OPTIONS: EmployeeCountType[] = [
	{
		value: EmployeeCount.ONE_TO_TWO,
		label: "1-2 salariés",
	},
	{
		value: EmployeeCount.THREE_TO_TEN,
		label: "3-10 salariés",
	},
	{
		value: EmployeeCount.ELEVEN_TO_FIFTY,
		label: "11-50 salariés",
	},
	{
		value: EmployeeCount.MORE_THAN_FIFTY,
		label: "Plus de 50 salariés",
	},
];
