import { Item } from "@/domain/entities/Item";
import { ItemEntity } from "@/infra/repository/entity/ItemEntity";

export interface ItemRepository {
	save(item: Item): Promise<void>;
	get(ids: string[]): Promise<ItemEntity[]>;
}
