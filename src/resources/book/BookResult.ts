import { Book } from "./domain/Book";
import { ErrorBase, ErrorsData } from "../error";

type BookErrorNames = "INVALID_DTO" | "DUPLICATED_BOOK" | "BOOK_NOT_FOUND";

export type BookResult = Book | Book[] | BookError;

export const BOOK_ERRORS: ErrorsData<BookErrorNames> = {
	INVALID_DTO: {
		message: "The sent informations are invalid, please check and try again.",
	},
	DUPLICATED_BOOK: {
		message: "This book is already registered.",
	},
	BOOK_NOT_FOUND: {
		message: "We don't have any book registered with this title.",
	},
};

export class BookError extends ErrorBase<BookErrorNames> {
	constructor(errorName: BookErrorNames) {
		super(errorName, BOOK_ERRORS[errorName].message);
	}
}
