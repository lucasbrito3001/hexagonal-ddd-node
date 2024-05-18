import { ErrorBase } from "./ErrorBase";

export class DatabaseConnectionError extends ErrorBase {
	constructor(cause: string) {
		super("DATABASE_CONNECTION_ERROR", "Database connection error", 500, cause);
	}
}

export class QueueConnectionError extends ErrorBase {
	constructor(cause: string) {
		super("QUEUE_CONNECTION_ERROR", "Queue connection error", 500, cause);
	}
}

export class MissingEnvVariableError extends ErrorBase {
	constructor(variable: string) {
		super("MISSING_ENV_VARIABLE", `Missing the env variable: ${variable}`, 500);
	}
}

export class InvalidTokenError extends ErrorBase {
	constructor() {
		super("INVALID_TOKEN", `Invalid authentication token`, 400);
	}
}
