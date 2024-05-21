import { ItemRepository } from "@/application/repository/ItemRepository";
import { Item } from "@/domain/entities/Item";

export class ItemRepositoryMemory implements ItemRepository {
	private items: Item[] = [];

	async save(item: Item): Promise<void> {
		this.items.push(item);
	}

	async get(ids: string[]): Promise<Item[]> {
		return this.items.filter((item) => ids.includes(item.id as string));
	}
}
