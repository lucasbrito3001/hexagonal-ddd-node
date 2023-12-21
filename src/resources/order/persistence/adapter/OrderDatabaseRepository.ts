import { Repository } from "typeorm";
import { OrderRepositoryPort } from "../port/OrderRepositoryPort";
import { RegisterOrderDTO } from "../../controller/dto/RegisterOrderDto";
import { OrderEntity } from "../OrderEntity";

export class OrderRepositoryDatabase implements OrderRepositoryPort {
	constructor(private readonly bookRepository: Repository<OrderEntity>) {}

	async save(registerOrderDTO: RegisterOrderDTO): Promise<void> {
		await this.bookRepository.insert(registerOrderDTO);
	}

	async update(id: string, registerOrderDTO: RegisterOrderDTO): Promise<void> {
		await this.bookRepository.update(id, registerOrderDTO);
	}

	async get(id: string): Promise<OrderEntity | null> {
		return await this.bookRepository.findOne({
			where: { id },
		});
	}
}
