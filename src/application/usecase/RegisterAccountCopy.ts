import { AccountRegisteredMesage } from "@/domain/event/AccountRegistered";
import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { AccountRepository } from "../repository/AccountRepository";
import { Account } from "@/domain/entities/Account";

export interface RegisterAccountCopyPort {
	execute(message: AccountRegisteredMesage): Promise<void>;
}

export class RegisterAccountCopy implements RegisterAccountCopyPort {
	private readonly accountRepository: AccountRepository;

	constructor(registry: DependencyRegistry) {
		this.accountRepository = registry.inject("accountRepository");
	}

	async execute(message: AccountRegisteredMesage): Promise<void> {
		const account = Account.instance(
			message.accountId,
			message.firstName,
			message.lastName,
			message.email
		);

		await this.accountRepository.save(account);
	}
}
