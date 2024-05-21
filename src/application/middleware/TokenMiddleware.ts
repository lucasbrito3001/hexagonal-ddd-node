import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { TokenService } from "../service/TokenService";
import { NextFunction, Request, Response } from "express";
import { InvalidTokenError } from "@/error/InfraError";

export class TokenMiddleware {
	private readonly tokenService: TokenService;

	constructor(registry: DependencyRegistry) {
		this.tokenService = registry.inject("tokenService");
	}

	validateAndDecodeToken = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const token = this.getHeaderToken(req.headers.authorization);

			const jwtPayload = this.tokenService.decode(token);

			req.body.jwtPayload = jwtPayload;
			next();
		} catch (error) {
			next(error);
		}
	};

	private getHeaderToken(authorization: string | undefined) {
		if (authorization === undefined) throw new InvalidTokenError();

		const auth = authorization.split(" ");

		if (auth.length !== 2 || auth[0] !== "Bearer" || typeof auth[1] !== "string")
			throw new InvalidTokenError();

		return auth[1];
	}
}
