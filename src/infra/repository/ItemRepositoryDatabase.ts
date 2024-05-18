import { In, Repository } from "typeorm";
import { ItemRepository } from "@/application/repository/ItemRepository";
import { Item } from "@/domain/entities/Item";
import { ItemEntity } from "./entity/Item.entity";

export class ItemRepositoryDatabase implements ItemRepository {
	constructor(private readonly itemRepository: Repository<ItemEntity>) {}

	async get(ids: string[]): Promise<Item[]> {
		const itemEntities = await this.itemRepository.find({
			where: {
				id: In(ids),
			},
		});

		return itemEntities.map((entity) =>
			Item.instance(entity.id as string, entity.unitPrice as number)
		);
	}

	async save(item: Item): Promise<void> {
		await this.itemRepository.save(item);
	}
}
