import { BookStocked } from "@/domain/event/BookStocked";
import { RegisterItemCopyPort } from "./interfaces/RegisterItemCopydPort";
import { ItemRepository } from "../repository/ItemRepository";
import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { Item } from "@/domain/entities/Item";

export class RegisterItemCopy implements RegisterItemCopyPort {
	private readonly itemRepository: ItemRepository;

	constructor(readonly registry: DependencyRegistry) {
		this.itemRepository = registry.inject("itemRepository");
	}

	async execute(bookStockedMessage: BookStocked): Promise<void> {
		const item = Item.create(
			bookStockedMessage.bookId,
			bookStockedMessage.unitPrice
		);

		await this.itemRepository.save(item);
	}
}
