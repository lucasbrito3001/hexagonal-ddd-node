import { Between, Repository } from "typeorm";
import { RegisterOrderDTO } from "../../application/controller/dto/RegisterOrderDto";
import { OrderRepository } from "@/application/repository/OrderRepository";
import {
	OrderEntity,
	OrderPaymentMethods,
	OrderStatus,
} from "./entity/Order.entity";
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
			orderEntity?.paymentMethod as OrderPaymentMethods,
			orderEntity?.totalCost as number,
			orderEntity?.createdAt as string
		);

		return order;
	}

	async list(startDate: Date, endDate: Date): Promise<OrderEntity[]> {
		startDate.setHours(0, 0, 0);
		endDate.setHours(23, 59, 59);

		return await this.orderRepository.find({
			where: {
				createdAt: Between(startDate, endDate),
			},
		});
	}
}
