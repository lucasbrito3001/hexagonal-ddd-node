import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { QueueSubscriber } from "./QueueSubscriber";
import { Logger } from "@/infra/log/Logger";
import { BookStockedMessage } from "@/domain/event/BookStocked";
import { RegisterItemCopy } from "@/application/usecase/RegisterItemCopy";

export class BookStockedSub implements QueueSubscriber {
	public queueName = "bookStocked";
	private readonly useCase: RegisterItemCopy;
	private logger: Logger;

	constructor(readonly registry: DependencyRegistry) {
		this.useCase = registry.inject("registerItemCopy");
		this.logger = registry.inject("logger");
	}

	private logMessage = (bookId: string): void => {
		this.logger.logEvent(
			"BookStocked",
			`Adding book ${bookId} to the database`
		);
	};

	public callbackFunction = async (message: BookStockedMessage) => {
		try {
			this.logMessage(message.bookId);
			await this.useCase.execute(message);
		} catch (error) {
			const errorAny = error as any;
			throw new Error(errorAny.message);
		}
	};
}
