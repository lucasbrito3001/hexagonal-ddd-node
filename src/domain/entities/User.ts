import { randomUUID } from "crypto";

export class User {
	constructor(public id: string, public name: string, public email: string) {}

	create(name: string, email: string, idGenerator: () => string = randomUUID) {
		const id = idGenerator();
		const user = new User(id, name, email);

		return user;
	}
}
