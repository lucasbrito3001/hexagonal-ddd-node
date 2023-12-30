import { ErrorBase, ErrorsData } from "./ErrorBase";

type OrderErrorNames =
	| "BOOK_NOT_FOUND"
	| "BOOK_UNAVAILABLE"
	| "INVALID_DTO"
	| "INVALID_DATE_RANGE"
	| "REQUIRED_DATE_RANGE"
	| "ORDER_NOT_FOUND";

export const ORDER_ERRORS: ErrorsData<OrderErrorNames> = {
	INVALID_DTO: {
		message: "The sent informations are invalid, please check and try again",
		httpCode: 400,
	},
	BOOK_UNAVAILABLE: {
		message: "Some of the books are unavailable",
		httpCode: 400,
	},
	BOOK_NOT_FOUND: {
		message: "Some of the books were not found in the database",
		httpCode: 400,
	},
	ORDER_NOT_FOUND: {
		message: "Was not found any orders in this date range",
		httpCode: 404,
	},
	INVALID_DATE_RANGE: {
		message:
			"The date range are not valid, the start date must be before the end date",
		httpCode: 400,
	},
	REQUIRED_DATE_RANGE: {
		message: "The date range is required",
		httpCode: 400,
	},
};

export class OrderError extends ErrorBase<OrderErrorNames> {
	constructor(errorName: OrderErrorNames) {
		super(
			errorName,
			ORDER_ERRORS[errorName].message,
			ORDER_ERRORS[errorName].httpCode
		);
	}
}
