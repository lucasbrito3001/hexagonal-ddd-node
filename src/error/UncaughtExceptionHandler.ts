import { Response } from "express";
import { ErrorBase } from "./ErrorBase";
import { Logger } from "@/infra/log/Logger";

export class UncaughtExceptionHandler {
	private readonly response: Response;
	private readonly logger: Logger;

	constructor(res: Response, logger: Logger) {
		this.response = res;
		this.logger = logger;
	}

	handle = (error: any) => {
		if (!(error instanceof ErrorBase)) {
			this.logger.unhandledError(error.message);
			this.response
				.status(500)
				.json({
					code: "INTERNAL_SERVER_ERROR",
					message:
						"We have an internal server error, please contact the administrator",
				});
			throw error;
		} else {
			this.logger.handledError(error.name, error.message);

			const { httpCode, cause, ...errorBase } = error;
			this.response.status(httpCode).json({
				...errorBase,
				...(process.env.NODE_ENV !== "production" && { cause }),
			});
		}
	};
}
