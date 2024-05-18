import { BookStockedMesage } from "@/domain/event/BookStocked";
import { ItemRepository } from "../repository/ItemRepository";
import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { Item } from "@/domain/entities/Item";

export interface RegisterItemCopyPort {
	execute(message: BookStockedMesage): Promise<void>;
}

export class RegisterItemCopy implements RegisterItemCopyPort {
	private readonly itemRepository: ItemRepository;

	constructor(readonly registry: DependencyRegistry) {
		this.itemRepository = registry.inject("itemRepository");
	}

	async execute(message: BookStockedMesage): Promise<void> {
		const item = Item.instance(message.bookId, message.unitPrice);

		await this.itemRepository.save(item);
	}
}
