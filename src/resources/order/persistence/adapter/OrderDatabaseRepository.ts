import { Between, Repository } from "typeorm";
import { OrderRepositoryPort } from "../port/OrderRepositoryPort";
import { RegisterOrderDTO } from "../../controller/dto/RegisterOrderDto";
import { OrderEntity } from "../order.entity";

export class OrderRepositoryDatabase implements OrderRepositoryPort {
	constructor(private readonly orderRepository: Repository<OrderEntity>) {}

	async save(registerOrderDTO: RegisterOrderDTO): Promise<void> {
		await this.orderRepository.insert(registerOrderDTO);
	}

	async update(id: string, registerOrderDTO: RegisterOrderDTO): Promise<void> {
		await this.orderRepository.update(id, registerOrderDTO);
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
