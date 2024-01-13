import { Order } from "@/domain/entities/Order";
import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { OrderRepository } from "../repository/OrderRepository";
import { OrderNotFoundError } from "@/error/OrderError";
import { OrderItemsApprovedOrRejected } from "@/domain/event/OrderItemsApprovedOrRejected";
import { ApproveOrderItemsPort } from "./interfaces/ApproveOrderItemsPort";

export class ApproveOrderItems implements ApproveOrderItemsPort {
	private readonly orderRepository: OrderRepository;

	constructor(readonly registry: DependencyRegistry) {
		this.orderRepository = registry.inject("orderRepository");
	}

	async execute(message: OrderItemsApprovedOrRejected): Promise<void> {
		const order = await this.orderRepository.get(message.orderId);

		if (order === null) throw new OrderNotFoundError();

		const orderWithItemsApproved = Order.approveOrderItems(order);

		await this.orderRepository.save(orderWithItemsApproved);
	}
}
