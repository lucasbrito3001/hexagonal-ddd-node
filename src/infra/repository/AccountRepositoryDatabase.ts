import { In, Repository } from "typeorm";
import { ItemRepository } from "@/application/repository/ItemRepository";
import { Item } from "@/domain/entities/Item";
import { ItemEntity } from "./entity/Item.entity";
import { AccountRepository } from "@/application/repository/AccountRepository";
import { AccountEntity } from "./entity/Account.entity";
import { Account } from "@/domain/entities/Account";

export class AccountRepositoryDatabase implements AccountRepository {
	constructor(private readonly accountRepository: Repository<AccountEntity>) {}

	async save(account: Account): Promise<void> {
		await this.accountRepository.save(account);
	}

	async get(id: string): Promise<Account | null> {
		const accountEntity = await this.accountRepository.findOneBy({ id });

		return Account.instance(
			accountEntity?.id as string,
			accountEntity?.firstName as string,
			accountEntity?.lastName as string,
			accountEntity?.email as string
		);
	}
}
