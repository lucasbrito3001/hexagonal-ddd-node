import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { QueueSubscriber } from "./QueueSubscriber";
import {
	OrderItemsApproved,
	OrderItemsApprovedOrRejectedMessage,
} from "@/domain/event/OrderItemsApprovedOrRejected";
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
