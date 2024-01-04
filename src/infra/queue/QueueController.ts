import { Queue } from "./Queue";
import { DependencyRegistry } from "../DependencyRegistry";
import { BookStocked } from "@/domain/event/BookStocked";
import { RegisterItemCopy } from "@/application/usecase/RegisterItemCopy";
import { Logger } from "../log/Logger";

export class QueueController {
	constructor(readonly registry: DependencyRegistry) {
		const queue: Queue = registry.inject("queue");
		const registerItemCopy: RegisterItemCopy =
			registry.inject("registerItemCopy");
		const logger: Logger = registry.inject("logger");

		queue.subscribe("bookStocked", async (message: BookStocked) => {
			logger.logEvent(
				"BookStocked",
				`Adding book ${message.bookId} to the copy database`
			);
			await registerItemCopy.execute(message);
		});

		queue.subscribe("priceUpdated", async (message: BookStocked) => {
			logger.logEvent(
				"BookStocked",
				`Adding book ${message.bookId} to the copy database`
			);
			await registerItemCopy.execute(message);
		});
	}
}
