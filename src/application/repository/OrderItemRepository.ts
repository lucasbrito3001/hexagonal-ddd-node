import { OrderItem } from "../../domain/entities/OrderItem";

export interface OrderItemRepository {
	save(orderItem: OrderItem): Promise<void>;
	get(id: string): Promise<OrderItem | null>;
}
