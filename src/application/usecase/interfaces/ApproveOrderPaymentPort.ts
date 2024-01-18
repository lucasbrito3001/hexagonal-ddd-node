import { OrderPaymentApproved } from "@/domain/event/OrderPaymentApproved";

export interface ApproveOrderPaymentPort {
	execute(message: OrderPaymentApproved): Promise<void>;
}
