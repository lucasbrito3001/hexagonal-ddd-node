import { ErrorBase, ErrorsData } from "../ErrorBase";

type OrderErrorNames = "BOOK_NOT_FOUND" | "BOOK_UNAVAILABLE" | "INVALID_DTO";

export const ORDER_ERRORS: ErrorsData<OrderErrorNames> = {
	INVALID_DTO: {
		message: "The sent informations are invalid, please check and try again.",
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
