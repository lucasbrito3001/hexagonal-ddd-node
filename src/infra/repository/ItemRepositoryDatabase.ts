import { In, Repository } from "typeorm";
import { ItemRepository } from "@/application/repository/ItemRepository";
import { Item } from "@/domain/entities/Item";
import { ItemEntity } from "./entity/Item.entity";

export class ItemRepositoryDatabase implements ItemRepository {
	constructor(private readonly itemRepository: Repository<ItemEntity>) {}

	async get(ids: string[]): Promise<ItemEntity[]> {
		return await this.itemRepository.find({
			where: {
				id: In(ids),
			},
		});
	}

	async save(item: Item): Promise<void> {
		await this.itemRepository.save(item);
	}
}
