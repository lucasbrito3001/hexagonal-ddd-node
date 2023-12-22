export type ErrorsData<T extends string> = {
	[K in T]: {
		message: string;
		cause?: any;
	};
};

export class ErrorBase<T extends string> implements Error {
	name: T;
	message: string;
	cause?: any;

	constructor(name: T, message: string, cause?: any) {
		this.name = name;
		this.message = message;
		this.cause = cause;
	}
}

export class UnexpectedError extends ErrorBase<"UNEXPECTED_ERROR"> {
	constructor() {
		super("UNEXPECTED_ERROR", "An unexpected error occurred.");
	}
}
