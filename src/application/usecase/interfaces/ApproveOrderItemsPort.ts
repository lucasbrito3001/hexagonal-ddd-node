import { OrderItemsApprovedOrRejected } from "@/domain/event/OrderItemsApprovedOrRejected";

export interface ApproveOrderItemsPort {
	execute(message: OrderItemsApprovedOrRejected): Promise<void>;
}
