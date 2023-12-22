import { ErrorBase, ErrorsData } from "../ErrorBase";

type OrderErrorNames = "BOOK_NOT_FOUND" | "BOOK_UNAVAILABLE" | "INVALID_DTO";

export const ORDER_ERRORS: ErrorsData<OrderErrorNames> = {
	INVALID_DTO: {
		message: "The sent informations are invalid, please check and try again.",
	},
	BOOK_UNAVAILABLE: {
		message: "Some of the books are unavailable",
	},
	BOOK_NOT_FOUND: {
		message: "Some of the books were not found in the database",
	},
};

export class OrderError extends ErrorBase<OrderErrorNames> {
	constructor(errorName: OrderErrorNames) {
		super(errorName, ORDER_ERRORS[errorName].message);
	}
}
