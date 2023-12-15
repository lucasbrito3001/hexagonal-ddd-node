import { ErrorBase, ErrorsData } from "../error";

type ErrorNames = "INVALID_DTO" | "DUPLICATED_BOOK" | "BOOK_NOT_FOUND";

export const ERRORS_DATA: ErrorsData<ErrorNames> = {
	INVALID_DTO: {
		message: "The sent informations are invalid, please check and try again.",
	},
	DUPLICATED_BOOK: {
		message: "This book is already registered.",
	},
	BOOK_NOT_FOUND: {
		message: "We don't have any book registered with this title.",
	}
};

export class BookError extends ErrorBase<ErrorNames> {}
