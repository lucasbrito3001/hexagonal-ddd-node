import { Between, Repository } from "typeorm";
import { RegisterOrderDTO } from "../../application/controller/dto/RegisterOrderDto";
import { OrderRepository } from "@/application/repository/OrderRepository";
import {
	OrderEntity,
	OrderPaymentMethods,
	OrderStatus,
} from "./entity/OrderEntity";
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

		const order = new Order(
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
		return await this.orderRepository.find({
			where: {
				createdAt: Between(startDate, endDate),
			},
		});
	}
}
