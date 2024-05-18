import { Event } from "../Base";

export type OrderItemsApprovedOrRejectedMessage = {
	orderId: string;
};

export class OrderItemsApproved implements Event {
	public readonly queueName: string = "orderItemsApproved";

	private constructor(
		public readonly message: OrderItemsApprovedOrRejectedMessage
	) {}

	static create(
		message: OrderItemsApprovedOrRejectedMessage
	): OrderItemsApproved {
		const event = new OrderItemsApproved(message);

		return event;
	}
}
