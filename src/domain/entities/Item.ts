import { randomUUID } from "crypto";

export class Item {
	private constructor(public id: string, public unitPrice: number) {}

	static create(id: string, unitPrice: number) {
		const book = new Item(id, unitPrice);

		return book;
	}
}
