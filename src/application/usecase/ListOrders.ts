import { ListOrdersPort } from "./interfaces/ListOrdersPort";
import { Order } from "@/domain/entities/Order";
import { OrderRepository } from "../repository/OrderRepository";
import { OrderError } from "@/error/OrderError";
import {
	OrderPaymentMethods,
	OrderStatus,
} from "@/infra/repository/entity/OrderEntity";
import { OrderItem } from "@/domain/entities/OrderItem";

export class ListOrders implements ListOrdersPort {
	constructor(private readonly orderRepository: OrderRepository) {}

	async execute(startDate: Date, endDate: Date): Promise<Order[] | OrderError> {
		const startDateMs = startDate.getTime();
		const endDateMs = endDate.getTime();

		if (startDateMs > endDateMs) return new OrderError("INVALID_DATE_RANGE");

		const orderEntities = await this.orderRepository.list(startDate, endDate);

		if (orderEntities.length === 0) return new OrderError("ORDER_NOT_FOUND");

		const orders = orderEntities.map(
			(orderEntity) =>
				new Order(
					orderEntity.id as string,
					orderEntity.user as string,
					orderEntity.items as OrderItem[],
					orderEntity.status as OrderStatus,
					orderEntity.paymentMethod as OrderPaymentMethods,
					orderEntity.totalCost as number,
					orderEntity.createdAt as string
				)
		);

		return orders;
	}
}
