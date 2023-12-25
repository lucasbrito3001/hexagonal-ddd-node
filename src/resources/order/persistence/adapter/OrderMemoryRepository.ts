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
		const index = this.orders.findIndex((stock) => stock.id === id);
		this.orders[index] = order as OrderEntity;
	}

	async get(id: string): Promise<OrderEntity | null> {
		return this.orders.find((stock) => stock.id === id) || null;
	}
}
