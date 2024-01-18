import { ListOrdersPort } from "./interfaces/ListOrdersPort";
import { Order } from "@/domain/entities/Order";
import { OrderRepository } from "../repository/OrderRepository";
import {
	OrderPaymentMethods,
	OrderStatus,
} from "@/infra/repository/entity/Order.entity";
import { OrderItem } from "@/domain/entities/OrderItem";
import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { InvalidDateRangeError, OrderNotFoundBetweenDateRangeError, OrderNotFoundError } from "@/error/OrderError";

export class ListOrders implements ListOrdersPort {
	private readonly orderRepository: OrderRepository;

	constructor(registry: DependencyRegistry) {
		this.orderRepository = registry.inject("orderRepository");
	}

	async execute(startDate: Date, endDate: Date): Promise<Order[]> {
		const startDateMs = startDate.getTime();
		const endDateMs = endDate.getTime();

		if (startDateMs > endDateMs) throw new InvalidDateRangeError();

		const orderEntities = await this.orderRepository.list(startDate, endDate);

		if (orderEntities.length === 0) throw new OrderNotFoundBetweenDateRangeError();

		const orders = orderEntities.map((orderEntity) =>
			Order.instance(
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
