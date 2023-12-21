import { RegisterOrderDTO } from "../../controller/dto/RegisterOrderDto";
import { Order } from "../../domain/Order";
import { OrderRepositoryPort } from "../port/OrderRepositoryPort";

export class OrderMemoryRepository implements OrderRepositoryPort {
	private orders: Order[] = [];

	async save(registerOrderDTO: RegisterOrderDTO): Promise<void> {
		const order = Order.register(registerOrderDTO);
		this.orders.push(order as Order);
	}

	async update(id: string, registerOrderDTO: RegisterOrderDTO): Promise<void> {
		const order = Order.register(registerOrderDTO);
		const index = this.orders.findIndex((stock) => stock.id === id);
		this.orders[index] = order as Order;
	}

	async get(id: string): Promise<Order | null> {
		return this.orders.find((stock) => stock.id === id) || null;
	}
}
