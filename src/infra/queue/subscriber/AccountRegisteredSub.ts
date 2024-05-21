import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { QueueSubscriber } from "./QueueSubscriber";
import { Logger } from "@/infra/log/Logger";
import { RegisterAccountCopyPort } from "@/application/usecase/RegisterAccountCopy";
import { AccountRegisteredMesage } from "@/domain/event/AccountRegistered";

export class AccountRegisteredSub implements QueueSubscriber {
	public queueName = "accountRegistered";

	private readonly useCase: RegisterAccountCopyPort;
	private logger: Logger;

	constructor(readonly registry: DependencyRegistry) {
		this.useCase = registry.inject("registerAccountCopy");
		this.logger = registry.inject("logger");
	}

	private logMessage = (accountId: string): void => {
		this.logger.logEvent(
			"AccountRegistered",
			`Adding account ${accountId} to the database`
		);
	};

	public callbackFunction = async (message: AccountRegisteredMesage) => {
		try {
			this.logMessage(message.accountId);
			await this.useCase.execute(message);
		} catch (error) {
			const errorAny = error as any;
			throw new Error(errorAny.message);
		}
	};
}
