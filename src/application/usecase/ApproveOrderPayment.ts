import { OrderPaymentApproved } from "@/domain/event/OrderPaymentApproved";
import { OrderRepository } from "../repository/OrderRepository";
import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { OrderNotFoundError } from "@/error/OrderError";
import { Order } from "@/domain/entities/Order";

export interface ApproveOrderPaymentPort {
	execute(message: OrderPaymentApproved): Promise<void>;
}

export class ApproveOrderPayment implements ApproveOrderPaymentPort {
	private readonly orderRepository: OrderRepository;

	constructor(registry: DependencyRegistry) {
		this.orderRepository = registry.inject("orderRepository");
	}

	async execute(message: OrderPaymentApproved): Promise<void> {
		const order = await this.orderRepository.get(message.orderId);

		if (order === null) throw new OrderNotFoundError();

		const orderUpdated = Order.approvePayment(order);

		await this.orderRepository.save(orderUpdated);
	}
}
