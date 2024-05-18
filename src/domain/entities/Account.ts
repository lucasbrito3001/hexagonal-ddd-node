import { BaseDomain } from "../Base";

export class Account extends BaseDomain {
	private constructor(
		public id: string,
		public firstName: string,
		public lastName: string,
		public email: string
	) {
		super();
	}

	static create(firstName: string, lastName: string, email: string) {
		const id = this.generateUUID();
		const user = new Account(id, firstName, lastName, email);

		return user;
	}

	static instance(
		accountId: string,
		firstName: string,
		lastName: string,
		email: string
	) {
		const user = new Account(accountId, firstName, lastName, email);

		return user;
	}
}
