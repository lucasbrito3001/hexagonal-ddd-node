import { OrderItemsApprovedOrRejected } from "@/domain/event/OrderItemsApprovedOrRejected";

export interface RejectOrderItemsPort {
	execute(message: OrderItemsApprovedOrRejected): Promise<void>;
}
