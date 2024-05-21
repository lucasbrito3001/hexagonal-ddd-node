import { Event } from "../Base";

export type BookStockedMessage = {
	bookId: string;
	unitPrice: number;
};

export class BookStocked implements Event {
	readonly queueName: string = "bookStocked";

	private constructor(public readonly message: BookStockedMessage) {}

	static create(message: BookStockedMessage): BookStocked {
		const event = new BookStocked(message);

		return event;
	}
}
