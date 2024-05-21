import { DeliveryStatus } from "@/infra/repository/entity/OrderItem.entity";
import { randomUUID } from "node:crypto";

export class OrderItem {
	private constructor(
		public id: string,
		public orderId: string,
		public itemId: string,
		public quantity: number,
		public unitPrice: number,
		public deliveryStatus: DeliveryStatus
	) {}

	static register = (
		orderId: string,
		itemId: string,
		quantity: number,
		unitPrice: number,
		idGenerator: () => `${string}-${string}-${string}-${string}-${string}` = randomUUID
	): OrderItem => {
		const id = idGenerator();

		const order = new OrderItem(
			id,
			orderId,
			itemId,
			quantity,
			unitPrice,
			DeliveryStatus.Pending
		);

		return order;
	};

	static instance = (
		id: string,
		orderId: string,
		itemId: string,
		quantity: number,
		unitPrice: number,
		deliveryStatus: DeliveryStatus
	): OrderItem => {
		const orderItem = new OrderItem(
			id,
			orderId,
			itemId,
			quantity,
			unitPrice,
			deliveryStatus
		);

		return orderItem;
	};

	static confirmReception = (
		id: string,
		orderId: string,
		itemId: string,
		quantity: number,
		unitPrice: number
	): OrderItem => {
		const orderItem = new OrderItem(
			id,
			orderId,
			itemId,
			quantity,
			unitPrice,
			DeliveryStatus.Delivered
		);

		return orderItem;
	};
}
