import express, { Express, NextFunction, Request, Response } from "express";
import { DataSourceConnection } from "./DataSource";
import { Server } from "http";
import { CONFIG_ROUTERS } from "./router";
import { DependencyRegistry } from "./DependencyRegistry";
import { OrderRepositoryDatabase } from "./repository/OrderRepositoryDatabase";
import { OrderEntity } from "./repository/entity/Order.entity";
import { RegisterOrder } from "@/application/usecase/RegisterOrder";
import { ItemEntity } from "./repository/entity/Item.entity";
import { ItemRepositoryDatabase } from "./repository/ItemRepositoryDatabase";
import { QueueController } from "./queue/QueueController";
import { RegisterItemCopy } from "@/application/usecase/RegisterItemCopy";
import { UncaughtExceptionHandler } from "@/error/UncaughtExceptionHandler";
import { ApproveOrderItems } from "@/application/usecase/ApproveOrderItems";
import { PriceUpdatedSub } from "./queue/subscriber/PriceUpdatedSub";
import { BookStockedSub } from "./queue/subscriber/BookStockedSub";
import { OrderItemsApprovedSub } from "./queue/subscriber/OrderItemsApprovedSub";
import { Logger } from "./log/Logger";
import { Queue } from "./queue/Queue";
import cors from "cors";
import { RejectOrderItemsSub } from "./queue/subscriber/OrderItemsRejectedSub";
import { RejectOrderItems } from "@/application/usecase/RejectOrderItems";
import { ListOrders } from "@/application/usecase/ListOrders";
import {
	DatabaseConnectionError,
	QueueConnectionError,
} from "@/error/InfraError";
import { TokenService } from "@/application/service/TokenService";
import { AccountRegisteredSub } from "./queue/subscriber/AccountRegisteredSub";
import { RegisterAccountCopy } from "@/application/usecase/RegisterAccountCopy";
import { AccountEntity } from "./repository/entity/Account.entity";
import { AccountRepositoryDatabase } from "./repository/AccountRepositoryDatabase";

export class WebServer {
	private server: Server | undefined;
	private app: Express = express();

	constructor(
		private dataSourceConnection: DataSourceConnection,
		private queue: Queue,
		private logger: Logger
	) {}

	start = async (isTest: boolean) => {
		this.app.use(express.json());
		this.app.use(cors());

		try {
			await this.dataSourceConnection.initialize();
		} catch (error) {
			throw new DatabaseConnectionError(error as any);
		}

		try {
			await this.queue.connect();
		} catch (error) {
			throw new QueueConnectionError(error as any);
		}

		const registry = await this.fillRegistry();

		this.setRoutes(registry);
		this.setQueueControllerSubscribers(registry);

		// Exception handler middleware
		this.app.use(
			(err: Error, req: Request, res: Response, next: NextFunction): void => {
				return new UncaughtExceptionHandler(res, this.logger).handle(err);
			}
		);

		if (isTest) return this.app;

		this.server = this.app.listen(process.env.PORT, () => {
			this.logger.log(
				`\n[SERVER] Server started, listening on port: ${process.env.PORT}\n`
			);
		});
	};

	private async fillRegistry() {
		const registry = new DependencyRegistry();

		const orderRepository = new OrderRepositoryDatabase(
			this.dataSourceConnection.getRepository(OrderEntity)
		);
		const itemRepository = new ItemRepositoryDatabase(
			this.dataSourceConnection.getRepository(ItemEntity)
		);
		const accountRepository = new AccountRepositoryDatabase(
			this.dataSourceConnection.getRepository(AccountEntity)
		);

		registry
			.push("orderRepository", orderRepository)
			.push("itemRepository", itemRepository)
			.push("accountRepository", accountRepository)
			.push("queue", this.queue)
			.push("logger", this.logger)
			.push("tokenService", new TokenService())
			.push("registerOrder", new RegisterOrder(registry))
			.push("listOrders", new ListOrders(registry))
			.push("registerItemCopy", new RegisterItemCopy(registry))
			.push("registerAccountCopy", new RegisterAccountCopy(registry))
			.push("approveOrderItems", new ApproveOrderItems(registry))
			.push("rejectOrderItems", new RejectOrderItems(registry));

		return registry;
	}

	private setQueueControllerSubscribers = (registry: DependencyRegistry) => {
		const subs = [
			new PriceUpdatedSub(registry),
			new BookStockedSub(registry),
			new OrderItemsApprovedSub(registry),
			new RejectOrderItemsSub(registry),
			new AccountRegisteredSub(registry),
		];

		new QueueController(registry).appendSubscribers(subs);
	};

	private setRoutes = (registry: DependencyRegistry) => {
		CONFIG_ROUTERS.forEach((config_router) => {
			const router = express.Router();
			new config_router(router, registry).expose();
			this.app.use("/", router);
		});

		this.app.get("/healthy", (_, res) => {
			res.send("Hello world!");
		});
	};

	gracefulShutdown = () => {
		if (!this.server) return;
		this.server.close();
	};
}
