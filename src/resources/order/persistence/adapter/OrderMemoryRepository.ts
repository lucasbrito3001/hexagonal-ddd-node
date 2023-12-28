import { RegisterOrderDTO } from "../../controller/dto/RegisterOrderDto";
import { Order } from "../../domain/Order";
import { OrderEntity } from "../order.entity";
import { OrderRepositoryPort } from "../port/OrderRepositoryPort";

export class OrderMemoryRepository implements OrderRepositoryPort {
	private orders: OrderEntity[] = [];

	async save(registerOrderDTO: RegisterOrderDTO): Promise<void> {
		const order = Order.register(registerOrderDTO);
		this.orders.push(order as OrderEntity);
	}

	async update(id: string, registerOrderDTO: RegisterOrderDTO): Promise<void> {
		const order = Order.register(registerOrderDTO);
		const index = this.orders.findIndex((order) => order.id === id);
		this.orders[index] = order as OrderEntity;
	}

	async get(id: string): Promise<OrderEntity | null> {
		return this.orders.find((order) => order.id === id) || null;
	}

	async list(initialDate: Date, endDate: Date): Promise<OrderEntity[]> {
		const initialDateMs = new Date(initialDate).getTime();
		const endDateMs = new Date(endDate).getTime();

		return this.orders.filter((order) => {
			const createdAtMs = new Date(order.createdAt as Date).getTime();
			return createdAtMs >= initialDateMs && createdAtMs <= endDateMs;
		});
	}
}
