import { BookStocked } from "@/domain/event/BookStocked";

export interface RegisterItemCopyPort {
	execute(bookStockedMessage: BookStocked): Promise<void>;
}
