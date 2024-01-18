import { OrderRepository } from "@/application/repository/OrderRepository";
import { Order } from "@/domain/entities/Order";
import {
	OrderEntity,
	OrderPaymentMethods,
	OrderStatus,
} from "../entity/Order.entity";
import { RegisterOrderDTO } from "@/application/controller/dto/RegisterOrderDto";
import { OrderItem } from "@/domain/entities/OrderItem";

export class OrderMemoryRepository implements OrderRepository {
	private orders: OrderEntity[] = [];

	async save(order: Order): Promise<void> {
		this.orders.push(order as unknown as OrderEntity);
	}

	async get(id: string): Promise<Order | null> {
		const order = this.orders.find((order) => order.id === id) || null;

		if (order === null) return null;

		return Order.instance(
			order?.id as string,
			order?.user as string,
			order?.items as OrderItem[],
			order?.status as OrderStatus,
			order?.paymentMethod as OrderPaymentMethods,
			order?.totalCost as number,
			order?.createdAt as string
		);
	}

	async list(initialDate: Date, endDate: Date): Promise<OrderEntity[]> {
		let initialDateMs = initialDate.setHours(0, 0, 0);
		initialDateMs = initialDate.getTime();

		let endDateMs = endDate.setHours(23, 59, 59);
		endDateMs = endDate.getTime();

		return this.orders.filter((order) => {
			const createdAtMs = new Date(order.createdAt as Date).getTime();
			return createdAtMs >= initialDateMs && createdAtMs <= endDateMs;
		});
	}
}
