import { Order } from "@/domain/entities/Order";
import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { OrderRepository } from "../repository/OrderRepository";
import { OrderNotFoundError } from "@/error/OrderError";
import {
	OrderItemsApproved,
	OrderItemsApprovedOrRejectedMessage,
} from "@/domain/event/OrderItemsApprovedOrRejected";
import { Queue } from "@/infra/queue/Queue";

export interface ApproveOrderItemsPort {
	execute(message: OrderItemsApprovedOrRejectedMessage): Promise<void>;
}

export class ApproveOrderItems implements ApproveOrderItemsPort {
	private readonly queue: Queue;
	private readonly orderRepository: OrderRepository;

	constructor(registry: DependencyRegistry) {
		this.queue = registry.inject("queue");
		this.orderRepository = registry.inject("orderRepository");
	}

	async execute(message: OrderItemsApprovedOrRejectedMessage): Promise<void> {
		const order = await this.orderRepository.get(message.orderId);

		if (order === null) throw new OrderNotFoundError();

		const orderWithItemsApproved = Order.approveOrderItems(order);

		await this.orderRepository.save(orderWithItemsApproved);
	}
}
