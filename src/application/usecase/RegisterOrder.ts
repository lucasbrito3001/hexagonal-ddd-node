import { RegisterOrderPort } from "./interfaces/RegisterOrderPort";
import { Order } from "@/domain/entities/Order";
import { RegisterOrderDTO } from "../controller/dto/RegisterOrderDto";
import { OrderRepository } from "../repository/OrderRepository";
import { OrderRegistered } from "@/domain/event/OrderRegistered";
import { Queue } from "@/infra/queue/Queue";
import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { ItemRepository } from "../repository/ItemRepository";

export class RegisterOrder implements RegisterOrderPort {
	private readonly orderRepository: OrderRepository;
	private readonly itemRepository: ItemRepository;
	private readonly queue: Queue;

	constructor(readonly registry: DependencyRegistry) {
		this.orderRepository = registry.inject("orderRepository");
		this.itemRepository = registry.inject("itemRepository");
		this.queue = registry.inject("queue");
	}

	async execute(
		registerOrderDTO: RegisterOrderDTO,
		userId: string
	): Promise<Output> {
		const itemsDTO = JSON.parse(JSON.stringify(registerOrderDTO.items));
		const itemIds = registerOrderDTO.items.map((item) => item.itemId);
		const itemPrices = await this.itemRepository.get(itemIds);

		registerOrderDTO.items = registerOrderDTO.items.map((item) => {
			const itemPrice = itemPrices.find(
				(itemPrice) => itemPrice.id === item.itemId
			);

			item.unitPrice = +(itemPrice?.unitPrice || 0);

			return item;
		});

		const order = Order.register(registerOrderDTO, userId);

		await this.orderRepository.save(order);

		await this.queue.publish(
			"orderRegistered",
			new OrderRegistered(order.id, itemsDTO)
		);

		return { orderId: order.id };
	}
}

export type Output = {
	orderId: string;
};
