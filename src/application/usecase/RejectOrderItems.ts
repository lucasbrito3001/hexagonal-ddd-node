import { Order } from "@/domain/entities/Order";
import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { OrderRepository } from "../repository/OrderRepository";
import { OrderNotFoundError } from "@/error/OrderError";
import { OrderItemsApprovedOrRejectedMessage } from "@/domain/event/OrderItemsApprovedOrRejected";

export interface RejectOrderItemsPort {
	execute(message: OrderItemsApprovedOrRejectedMessage): Promise<void>;
}

export class RejectOrderItems implements RejectOrderItemsPort {
	private readonly orderRepository: OrderRepository;

	constructor(readonly registry: DependencyRegistry) {
		this.orderRepository = registry.inject("orderRepository");
	}

	async execute(message: OrderItemsApprovedOrRejectedMessage): Promise<void> {
		const order = await this.orderRepository.get(message.orderId);

		if (order === null) throw new OrderNotFoundError();

		const orderRejected = Order.rejectOrderItems(order);

		await this.orderRepository.save(orderRejected);
	}
}
