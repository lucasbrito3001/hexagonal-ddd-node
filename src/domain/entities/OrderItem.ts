import { randomUUID } from "node:crypto";

export class OrderItem {
	private constructor(
		public id: string,
		public orderId: string,
		public itemId: string,
		public quantity: number,
		public unitPrice: number
	) {}

	static register = (
		orderId: string,
		itemId: string,
		quantity: number,
		unitPrice: number,
		idGenerator: () => `${string}-${string}-${string}-${string}-${string}` = randomUUID
	): OrderItem => {
		const id = idGenerator();

		const order = new OrderItem(id, orderId, itemId, quantity, unitPrice);

		return order;
	};
}
