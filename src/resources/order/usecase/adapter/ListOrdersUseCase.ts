import { BookRepositoryPort } from "@/resources/book/persistence/port/BookRepositoryPort";
import { OrderError } from "../../OrderError";
import { RegisterOrderDTO } from "../../controller/dto/RegisterOrderDto";
import { Order } from "../../domain/Order";
import { OrderRepositoryPort } from "../../persistence/port/OrderRepositoryPort";
import { RegisterOrderPort } from "../port/RegisterOrderPort";
import { ZodError } from "zod";
import { ListOrdersPort } from "../port/ListOrdersPort";

export class ListOrdersUseCase implements ListOrdersPort {
	constructor(private readonly orderRepository: OrderRepositoryPort) {}

	async execute(startDate: Date, endDate: Date): Promise<Order[] | OrderError> {
		if (!startDate || !endDate) return new OrderError("INVALID_DATE_RANGE");

		const orderEntities = await this.orderRepository.list(startDate, endDate);

		if (orderEntities.length === 0) return new OrderError("ORDER_NOT_FOUND");

		const orders = orderEntities
			.map((orderEntity) => {
				const order = Order.register(orderEntity as RegisterOrderDTO);
				if (order instanceof Order) return order;
				else return undefined;
			})
			.filter((order) => order);

		return orders as Order[];
	}
}
