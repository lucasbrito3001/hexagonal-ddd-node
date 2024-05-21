import { Order } from "@/domain/entities/Order";
import { OrderRepository } from "../repository/OrderRepository";
import { DependencyRegistry } from "@/infra/DependencyRegistry";
import {
	InvalidDateRangeError,
	OrderNotFoundBetweenDateRangeError,
} from "@/error/OrderError";

export interface ListOrdersPort {
	execute(startDate: Date, endDate: Date): Promise<Order[]>;
}

export class ListOrders implements ListOrdersPort {
	private readonly orderRepository: OrderRepository;

	constructor(registry: DependencyRegistry) {
		this.orderRepository = registry.inject("orderRepository");
	}

	async execute(startDate: Date, endDate: Date): Promise<Order[]> {
		const startDateMs = startDate.getTime();
		const endDateMs = endDate.getTime();

		if (startDateMs > endDateMs) throw new InvalidDateRangeError();

		const orders = await this.orderRepository.list(startDate, endDate);

		if (orders.length === 0) throw new OrderNotFoundBetweenDateRangeError();

		return orders;
	}
}
