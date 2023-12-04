import { ErrorBase, ErrorsData } from "../error";

type ErrorNames = "INVALID_DTO" | "DUPLICATED_BOOK";

export const ERRORS_DATA: ErrorsData<ErrorNames> = {
	INVALID_DTO: {
		message: "The sent informations are invalid, please check and try again.",
	},
	DUPLICATED_BOOK: {
		message: "This book is already registered.",
	},
};

export class BookError extends ErrorBase<ErrorNames> {}
