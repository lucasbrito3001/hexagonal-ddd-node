import { RegisterAccountCopy, RegisterAccountCopyPort } from "@/application/usecase/RegisterAccountCopy";
import { AccountRegisteredMesage } from "@/domain/event/AccountRegistered";
import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { AccountMemoryRepository } from "@/infra/repository/mock/AccountRepositoryMemory";
import { beforeEach, describe, expect, test } from "vitest";

describe("[Use Case - RegisterAccountCopy]", () => {
	const registry = new DependencyRegistry();
    
	let registerAccountCopy: RegisterAccountCopyPort;
	let accountMemoryRepository: AccountMemoryRepository;

	beforeEach(() => {
		accountMemoryRepository = new AccountMemoryRepository();

		registry.push("accountRepository", accountMemoryRepository);

		registerAccountCopy = new RegisterAccountCopy(registry);
	});

	test("should save account copy successfully", async () => {
		const message: AccountRegisteredMesage = {
			accountId: "0",
			firstName: "John",
			lastName: "Doe",
			email: "john@doe.com",
		};

		expect(registerAccountCopy.execute(message)).resolves.not.toThrow();
	});
});
