import { ErrorBase } from "./ErrorBase";

export class InvalidOrderInputError extends ErrorBase {
	constructor(cause: any) {
		super("INVALID_INPUT", "The input is invalid.", 400, cause);
	}
}

export class OrderNotFoundError extends ErrorBase {
	constructor() {
		super("ORDER_NOT_FOUND", "No order was found with this id.", 400);
	}
}

export class OrderNotFoundBetweenDateRangeError extends ErrorBase {
	constructor() {
		super("ORDER_NOT_FOUND_BETWEEN_DATE_RANGE", "No order was found in this date range.", 400);
	}
}

export class InvalidDateRangeError extends ErrorBase {
	constructor() {
		super(
			"INVALID_DATE_RANGE",
			"The date range are not valid, the start date must be before the end date",
			400
		);
	}
}

export class RequiredDateRangeError extends ErrorBase {
	constructor() {
		super("REQUIRED_DATE_RANGE", "The date range is required", 400);
	}
}
