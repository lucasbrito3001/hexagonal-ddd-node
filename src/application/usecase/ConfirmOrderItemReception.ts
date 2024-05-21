import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { ConfirmOrderItemReceptionInput } from "../controller/dto/ConfirmOrderItemReceptionInput";
import { OrderItemRepository } from "../repository/OrderItemRepository";
import { OrderItemNotFoundError } from "@/error/OrderItemError";
import { OrderItem } from "@/domain/entities/OrderItem";
import { DeliveryStatus } from "@/infra/repository/entity/OrderItem.entity";

export interface ConfirmOrderItemReceptionPort {
	execute(
		input: ConfirmOrderItemReceptionInput
	): Promise<ConfirmOrderItemReceptionOutput>;
}

export class ConfirmOrderItemReceptionOutput {
	constructor(
		public orderItemId: string,
		public deliveryStatus: DeliveryStatus
	) {}
}

export class ConfirmOrderItemReception
	implements ConfirmOrderItemReceptionPort
{
	private readonly orderItemRepository: OrderItemRepository;

	constructor(registry: DependencyRegistry) {
		this.orderItemRepository = registry.inject("orderItemRepository");
	}

	async execute(
		input: ConfirmOrderItemReceptionInput
	): Promise<ConfirmOrderItemReceptionOutput> {
		const orderItem = await this.orderItemRepository.get(input.orderItemId);

		if (!orderItem) throw new OrderItemNotFoundError();

		const orderItemUpdated = OrderItem.confirmReception(
			orderItem.id,
			orderItem.orderId,
			orderItem.itemId,
			orderItem.quantity,
			orderItem.unitPrice
		);

		await this.orderItemRepository.save(orderItemUpdated);

		return new ConfirmOrderItemReceptionOutput(
			orderItemUpdated.id,
			orderItemUpdated.deliveryStatus
		);
	}
}
