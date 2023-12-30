import { ListOrdersPort } from "./interfaces/ListOrdersPort";
import { Order } from "@/domain/entities/Order";
import { OrderRepository } from "../repository/OrderRepository";
import { OrderError } from "@/error/OrderError";
import { RegisterOrderDTO } from "../controller/dto/RegisterOrderDto";

export class ListOrders implements ListOrdersPort {
	constructor(private readonly orderRepository: OrderRepository) {}

	async execute(startDate: Date, endDate: Date): Promise<Order[] | OrderError> {
		const startDateMs = startDate.getTime();
		const endDateMs = endDate.getTime();

		if (startDateMs > endDateMs) return new OrderError("INVALID_DATE_RANGE");

		const orderEntities = await this.orderRepository.list(startDate, endDate);

		if (orderEntities.length === 0) return new OrderError("ORDER_NOT_FOUND");

		const orders = orderEntities.map((orderEntity) =>
			Order.register(orderEntity as RegisterOrderDTO)
		);

		return orders as Order[];
	}
}
