import { Between, Repository } from "typeorm";
import { OrderRepository } from "@/application/repository/OrderRepository";
import { OrderEntity, OrderStatus } from "./entity/Order.entity";
import { Order } from "@/domain/entities/Order";
import { OrderItem } from "@/domain/entities/OrderItem";

export class OrderRepositoryDatabase implements OrderRepository {
	constructor(private readonly orderRepository: Repository<OrderEntity>) {}

	async save(order: Order): Promise<void> {
		await this.orderRepository.save(order);
	}

	async get(id: string): Promise<Order | null> {
		const orderEntity = await this.orderRepository.findOne({
			where: { id },
		});

		if (orderEntity === null) return null;

		const order = Order.instance(
			orderEntity?.id as string,
			orderEntity?.user as string,
			orderEntity?.items as OrderItem[],
			orderEntity?.status as OrderStatus,
			orderEntity?.totalCost as number,
			orderEntity?.createdAt as string
		);

		return order;
	}

	async list(startDate: Date, endDate: Date): Promise<Order[]> {
		startDate.setHours(0, 0, 0, 0);
		endDate.setHours(+23, 59, 59, 999);

		const orderEntities = await this.orderRepository.find({
			where: {
				createdAt: Between(startDate.toISOString(), endDate.toISOString()),
			},
			relations: {
				items: true,
			},
		});

		const orders = orderEntities.map((orderEntity) =>
			Order.instance(
				orderEntity.id as string,
				orderEntity.user as string,
				orderEntity.items as OrderItem[],
				orderEntity.status as OrderStatus,
				orderEntity.totalCost as number,
				orderEntity.createdAt as string
			)
		);

		return orders;
	}
}
