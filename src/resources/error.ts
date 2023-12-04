export type ErrorsData<T extends string> = {
	[K in T]: {
		message: string;
		cause?: any;
	};
};

export class ErrorBase<T extends string> extends Error {
	name: T;
	message: string;
	cause?: any;

	constructor(name: T, message: string, cause?: any) {
		super();
		this.name = name;
		this.message = message;
		this.cause = cause;
	}
}

export class UnexpectedError extends Error {
	name: string = "UNEXPECTED_ERROR";

	constructor() {
		super("An unexpected error occurred.");
	}
}
