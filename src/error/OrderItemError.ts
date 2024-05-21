import { ErrorBase } from "./ErrorBase";

export class OrderItemNotFoundError extends ErrorBase {
	constructor() {
		super(
			"ORDER_ITEM_NOT_FOUND",
			"Some of the order items were not found in the database",
			400
		);
	}
}

export class OrderItemUnavailableError extends ErrorBase {
	constructor() {
		super("BOOK_UNAVAILABLE", "Some of the order items are unavailable", 400);
	}
}
