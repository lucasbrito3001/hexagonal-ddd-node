import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { QueueSubscriber } from "./QueueSubscriber";
import { ApproveOrderItems } from "@/application/usecase/ApproveOrderItems";
import { OrderItemsApprovedOrRejected } from "@/domain/event/OrderItemsApprovedOrRejected";
import { Logger } from "@/infra/log/Logger";

export class ApproveOrderItemsSub implements QueueSubscriber {
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

	public callbackFunction = async (message: OrderItemsApprovedOrRejected) => {
		this.logMessage(message.orderId);
		this.useCase.execute(message);
	};
}
