import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { QueueSubscriber } from "./QueueSubscriber";
import { OrderItemsApprovedOrRejected } from "@/domain/event/OrderItemsApprovedOrRejected";
import { Logger } from "@/infra/log/Logger";
import { RejectOrderItems } from "@/application/usecase/RejectOrderItems";

export class RejectOrderItemsSub implements QueueSubscriber {
	public queueName = "orderItemsRejected";
	private readonly useCase: RejectOrderItems;
	private logger: Logger;

	constructor(readonly registry: DependencyRegistry) {
		this.useCase = registry.inject("rejectOrderItems");
		this.logger = registry.inject("logger");
	}

	private logMessage = (orderId: string): void => {
		this.logger.logEvent(
			"OrderItemsRejected",
			`Updating order status ${orderId} to ITEMS_REJECTED`
		);
	};

	public callbackFunction = async (message: OrderItemsApprovedOrRejected) => {
		this.logMessage(message.orderId);
		this.useCase.execute(message);
	};
}
