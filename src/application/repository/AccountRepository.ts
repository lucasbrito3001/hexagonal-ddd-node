import { Account } from "../../domain/entities/Account";

export interface AccountRepository {
	save(account: Account): Promise<void>;
	get(id: string): Promise<Account | null>;
}
