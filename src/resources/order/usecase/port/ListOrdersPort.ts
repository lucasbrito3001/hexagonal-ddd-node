import { OrderError } from "../../OrderError";
import { Order } from "../../domain/Order";

export interface ListOrdersPort {
	execute(startDate: Date, endDate: Date): Promise<Order[] | OrderError>;
}
