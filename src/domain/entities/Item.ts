import { randomUUID } from "crypto";
import { BaseDomain } from "../Base";

export class Item extends BaseDomain {
	private constructor(public id: string, public unitPrice: number) {
		super();
	}

	static create(unitPrice: number) {
		const id = this.generateUUID();
		const book = new Item(id, unitPrice);

		return book;
	}

	static instance(id: string, unitPrice: number) {
		const book = new Item(id, unitPrice);

		return book;
	}
}
