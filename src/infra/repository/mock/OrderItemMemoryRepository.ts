import { OrderItemRepository } from "@/application/repository/OrderItemRepository";
import { OrderItem } from "@/domain/entities/OrderItem";

export class OrderItemMemoryRepository implements OrderItemRepository {
	private orderItems: OrderItem[] = [];

	async save(orderItem: OrderItem): Promise<void> {
		this.orderItems.push(orderItem);
	}

	async get(id: string): Promise<OrderItem | null> {
		const orderItem = this.orderItems.find((orderItem) => orderItem.id === id);

		if (orderItem === undefined) return null;

		return orderItem;
	}
}
