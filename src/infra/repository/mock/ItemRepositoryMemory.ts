import { Order } from "@/domain/entities/Order";
import { OrderEntity } from "../entity/OrderEntity";
import { RegisterOrderDTO } from "@/application/controller/dto/RegisterOrderDto";
import { ItemRepository } from "@/application/repository/ItemRepository";
import { ItemEntity } from "../entity/ItemEntity";
import { Item } from "@/domain/entities/Item";

export class ItemRepositoryMemory implements ItemRepository {
	private items: ItemEntity[] = [];

	async save(item: Item): Promise<void> {
		const createdItem = Item.create(item.unitPrice);
		this.items.push(createdItem as unknown as ItemEntity);
	}

	async get(ids: string[]): Promise<ItemEntity[]> {
		return this.items.filter((item) => ids.includes(item.id as string));
	}
}
