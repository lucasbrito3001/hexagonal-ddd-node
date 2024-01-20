import { OrderEntity } from "@/infra/repository/entity/Order.entity";
import { Order } from "../../domain/entities/Order";

export interface OrderRepository {
	save(order: Order): Promise<void>;
	get(id: string): Promise<Order | null>;
	list(initialDate: Date, endDate: Date): Promise<Order[]>;
}
