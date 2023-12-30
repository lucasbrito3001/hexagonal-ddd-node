import { Between, Repository } from "typeorm";
import { RegisterOrderDTO } from "../../application/controller/dto/RegisterOrderDto";
import { OrderRepository } from "@/application/repository/OrderRepository";
import { OrderEntity } from "./entity/OrderEntity";

export class OrderRepositoryDatabase implements OrderRepository {
	constructor(private readonly orderRepository: Repository<OrderEntity>) {}

	async save(
		registerOrderDTO: Exclude<RegisterOrderDTO, "books">
	): Promise<void> {
		await this.orderRepository.insert({
			...registerOrderDTO,
			books: [],
		});
	}

	async get(id: string): Promise<OrderEntity | null> {
		return await this.orderRepository.findOne({
			where: { id },
		});
	}

	async list(startDate: Date, endDate: Date): Promise<OrderEntity[]> {
		return await this.orderRepository.find({
			where: {
				createdAt: Between(startDate, endDate),
			},
		});
	}
}
