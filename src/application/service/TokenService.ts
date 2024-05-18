import { JwtPayload, verify } from "jsonwebtoken";

export class TokenService {
	decode(token: string): string | JwtPayload {
		const payload = verify(token, process.env.JWT_SECRET as string);
		return payload;
	}
}
