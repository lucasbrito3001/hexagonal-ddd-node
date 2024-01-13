import { randomUUID } from "crypto";

export class User {
	constructor(
		public id: string,
		public first_name: string,
		public last_name: string,
		public email: string
	) {}

	create(
		first_name: string,
		last_name: string,
		email: string,
		idGenerator: () => string = randomUUID
	) {
		const id = idGenerator();
		const user = new User(id, first_name, last_name, email);

		return user;
	}
}
