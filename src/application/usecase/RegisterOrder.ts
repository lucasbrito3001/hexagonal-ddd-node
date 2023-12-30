import { RegisterOrderPort } from "./interfaces/RegisterOrderPort";
import { Order } from "@/domain/entities/Order";
import { RegisterOrderDTO } from "../controller/dto/RegisterOrderDto";
import { BookRepository } from "../repository/BookRepository";
import { OrderRepository } from "../repository/OrderRepository";
import { OrderRegistered } from "@/domain/event/OrderRegistered";
import { Queue } from "@/infra/queue/Queue";
import { DependencyRegistry } from "@/infra/DependencyRegistry";

export class RegisterOrder implements RegisterOrderPort {
	private readonly orderRepository: OrderRepository;
	private readonly bookRepository: BookRepository;
	private readonly queue: Queue;

	constructor(readonly registry: DependencyRegistry) {
		this.orderRepository = registry.inject("orderRepository");
		this.bookRepository = registry.inject("bookRepository");
		this.queue = registry.inject("queue");
	}

	async execute(registerOrderDTO: RegisterOrderDTO): Promise<Output> {
		const books = (
			await this.bookRepository.searchByIds(registerOrderDTO.books)
		).map((book) => ({
			id: book.id as string,
			quantity: book.quantity as number,
		}));

		const order = Order.register(registerOrderDTO);
		await this.orderRepository.save({ ...order, books: [] });

		await this.queue.publish(
			"orderRegistered",
			new OrderRegistered(order.id, books)
		);

		return { orderId: order.id };
	}
}

export type Output = {
	orderId: string;
};
