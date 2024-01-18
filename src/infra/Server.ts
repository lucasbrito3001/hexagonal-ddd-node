import express, { Express, NextFunction, Request, Response } from "express";
import { DataSourceConnection } from "./DataSource";
import { Server } from "http";
import { CONFIG_ROUTERS } from "./router";
import { DependencyRegistry } from "./DependencyRegistry";
import { OrderRepositoryDatabase } from "./repository/OrderRepositoryDatabase";
import { OrderEntity } from "./repository/entity/Order.entity";
import { RegisterOrder } from "@/application/usecase/RegisterOrder";
import { RabbitMQAdapter } from "./queue/RabbitMQAdapter";
import { ItemEntity } from "./repository/entity/Item.entity";
import { ItemRepositoryDatabase } from "./repository/ItemRepositoryDatabase";
import { QueueController } from "./queue/QueueController";
import { RegisterItemCopy } from "@/application/usecase/RegisterItemCopy";
import { GeneralLogger } from "./log/GeneralLogger";
import { UncaughtExceptionHandler } from "@/error/UncaughtExceptionHandler";
import { ApproveOrderItems } from "@/application/usecase/ApproveOrderItems";
import { PriceUpdatedSub } from "./queue/subscriber/PriceUpdatedSub";
import { BookStockedSub } from "./queue/subscriber/BookStockedSub";
import { ApproveOrderItemsSub } from "./queue/subscriber/ApproveOrderItemsSub";
import { Logger } from "./log/Logger";
import { Queue } from "./queue/Queue";
import cors from "cors";
import { RejectOrderItemsSub } from "./queue/subscriber/RejectOrderItemsSub";
import { RejectOrderItems } from "@/application/usecase/RejectOrderItems";
import { ListOrders } from "@/application/usecase/ListOrders";

export class WebServer {
	private server: Server | undefined;
	private app: Express = express();

	constructor(private dataSourceConnection: DataSourceConnection) {}

	start = async (isTest: boolean) => {
		this.app.use(express.json());
		this.app.use(cors());

		const logger = new GeneralLogger();
		const queue = await this.connectToQueue(logger);

		try {
			await this.dataSourceConnection.initialize();
		} catch (error) {
			logger.error(error);
		}

		const registry = await this.fillRegistry(logger, queue);

		this.setRoutes(registry);
		this.setQueueControllerSubscribers(registry);

		// Exception handler middleware
		this.app.use(
			(err: Error, req: Request, res: Response, next: NextFunction): void => {
				return new UncaughtExceptionHandler(res, logger).handle(err);
			}
		);

		if (isTest) return this.app;

		this.server = this.app.listen(process.env.PORT, () => {
			logger.log(
				"\n[SERVER] Server started, listening on port: " + process.env.PORT
			);
		});
	};

	private async connectToQueue(logger: Logger): Promise<Queue> {
		const queue = new RabbitMQAdapter(logger);
		await queue.connect();
		return queue;
	}

	private async fillRegistry(logger: Logger, queue: Queue) {
		const registry = new DependencyRegistry();

		const orderRepository = new OrderRepositoryDatabase(
			this.dataSourceConnection.getRepository(OrderEntity)
		);
		const itemRepository = new ItemRepositoryDatabase(
			this.dataSourceConnection.getRepository(ItemEntity)
		);

		registry
			.push("orderRepository", orderRepository)
			.push("itemRepository", itemRepository)
			.push("queue", queue)
			.push("logger", logger)
			.push("registerOrder", new RegisterOrder(registry))
			.push("listOrders", new ListOrders(registry))
			.push("registerItemCopy", new RegisterItemCopy(registry))
			.push("approveOrderItems", new ApproveOrderItems(registry))
			.push("rejectOrderItems", new RejectOrderItems(registry));

		return registry;
	}

	private setQueueControllerSubscribers = (registry: DependencyRegistry) => {
		const subs = [
			new PriceUpdatedSub(registry),
			new BookStockedSub(registry),
			new ApproveOrderItemsSub(registry),
			new RejectOrderItemsSub(registry),
		];

		new QueueController(registry).appendSubscribers(subs);
	};

	private setRoutes = (registry: DependencyRegistry) => {
		CONFIG_ROUTERS.forEach((config_router) => {
			const router = express.Router();
			new config_router(router, registry).expose();
			this.app.use("/", router);
		});

		this.app.get("/healthy", (req, res) => {
			res.send("Hello world!");
		});
	};

	gracefulShutdown = () => {
		if (!this.server) return;
		this.server.close();
	};
}
