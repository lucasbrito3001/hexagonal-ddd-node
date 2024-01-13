import { Order } from "@/domain/entities/Order";
import { OrderError } from "@/error/OrderError";

export interface ListOrdersPort {
	execute(startDate: Date, endDate: Date): Promise<Order[] | OrderError>;
}
