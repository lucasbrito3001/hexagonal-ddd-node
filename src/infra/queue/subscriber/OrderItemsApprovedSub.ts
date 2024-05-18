import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { QueueSubscriber } from "./QueueSubscriber";
import { ApproveOrderItems } from "@/application/usecase/ApproveOrderItems";
import { OrderItemsApprovedOrRejectedMessage } from "@/domain/event/OrderItemsApprovedOrRejected";
import { Logger } from "@/infra/log/Logger";

export class OrderItemsApprovedSub implements QueueSubscriber {
	public queueName = "orderItemsApproved";
	private readonly useCase: ApproveOrderItems;
	private logger: Logger;

	constructor(readonly registry: DependencyRegistry) {
		this.useCase = registry.inject("approveOrderItems");
		this.logger = registry.inject("logger");
	}

	private logMessage = (orderId: string): void => {
		this.logger.logEvent(
			"OrderItemsApproved",
			`Updating order status ${orderId} to ITEMS_APPROVED`
		);
	};

	public callbackFunction = async (
		message: OrderItemsApprovedOrRejectedMessage
	) => {
		try {
			this.logMessage(message.orderId);
			await this.useCase.execute(message);
		} catch (error) {
			const errorAny = error as any;
			throw new Error(errorAny.message);
		}
	};
}
