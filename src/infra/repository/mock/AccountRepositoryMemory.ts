import { AccountRepository } from "@/application/repository/AccountRepository";
import { Account } from "@/domain/entities/Account";

export class AccountMemoryRepository implements AccountRepository {
	private accounts: Account[] = [];

	async save(item: Account): Promise<void> {
		this.accounts.push(item);
	}

	async get(id: string): Promise<Account | null> {
		const account = this.accounts.find((item) => id === item.id);

		if (account === undefined) return null;

		return account;
	}
}
