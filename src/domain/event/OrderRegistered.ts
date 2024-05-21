import { OrderItemEntity } from "@/infra/repository/entity/OrderItem.entity";
import { Event } from "../Base";
import { OrderItem } from "../entities/OrderItem";
import { Account } from "../entities/Account";

export type OrderItemMessage = {
	itemId: string;
	quantity: number;
};

export type OrderRegisteredMessage = {
	orderId: string;
	accountId: string;
	items: OrderItemMessage[];
	value: number;
};

export class OrderRegistered implements Event {
	public readonly queueName: string = "orderRegistered";

	private constructor(public readonly message: OrderRegisteredMessage) {}

	static create(
		orderId: string,
		items: OrderItem[],
		accountId: string,
		value: number
	): OrderRegistered {
		const message = {
			orderId,
			accountId,
			value,
			items: items.map((item) => ({
				itemId: item.itemId,
				quantity: item.quantity,
			})),
		};

		return new OrderRegistered(message);
	}
}
