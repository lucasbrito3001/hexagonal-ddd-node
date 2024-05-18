import { RegisterItemCopy, RegisterItemCopyPort } from "@/application/usecase/RegisterItemCopy";
import { Item } from "@/domain/entities/Item";
import { BookStockedMesage } from "@/domain/event/BookStocked";
import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { ItemRepositoryMemory } from "@/infra/repository/mock/ItemRepositoryMemory";
import { beforeEach, describe, expect, test, vi } from "vitest";

describe("[Use Case - RegisterItemCopy]", () => {
	const registry = new DependencyRegistry();

	let registerItemCopy: RegisterItemCopyPort;
	let itemMemoryRepository: ItemRepositoryMemory;

	beforeEach(() => {
		itemMemoryRepository = new ItemRepositoryMemory();

		registry.push("itemRepository", itemMemoryRepository);

		registerItemCopy = new RegisterItemCopy(registry);
	});

	test("should save item copy successfully", async () => {
		const spySave = vi.spyOn(itemMemoryRepository, "save");

		const message: BookStockedMesage = {
			bookId: "0",
			unitPrice: 100,
		};

		expect(registerItemCopy.execute(message)).resolves.not.toThrow();
		expect(spySave.mock.calls[0][0]).toBeInstanceOf(Item);
	});
});
