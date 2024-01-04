import { randomUUID } from "node:crypto";
import { RegisterOrderDTO } from "@/application/controller/dto/RegisterOrderDto";
import { OrderStatus } from "@/infra/repository/entity/OrderEntity";
import { OrderItems } from "../event/OrderRegistered";

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
