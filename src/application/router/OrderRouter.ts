import { BookController } from "@/resources/book/controller/BookController";
import { BookCoverCloudFileStorage } from "@/resources/book/persistence/adapter/BookCloudFileStorage";
import { BookRepositoryDatabase } from "@/resources/book/persistence/adapter/BookDatabaseRepository";
import { StockBookUseCase } from "@/resources/book/usecase/adapter/StockBookUseCase";
import { Router } from "express";
import { randomUUID } from "node:crypto";
import { DataSourceConnection } from "../DataSource";
import { GetStockedBooksUseCase } from "@/resources/book/usecase/adapter/GetStockedBooksUseCase";
import { OrderEntity } from "@/resources/order/persistence/order.entity";
import { OrderRepositoryDatabase } from "@/resources/order/persistence/adapter/OrderDatabaseRepository";
import { RegisterOrderUseCase } from "@/resources/order/usecase/adapter/RegisterOrderUseCase";
import { OrderController } from "@/resources/order/controller/OrderController";
import { ListOrdersUseCase } from "@/resources/order/usecase/adapter/ListOrdersUseCase";

export class OrderRouter {
	private orderController: OrderController;

	constructor(
		private router: Router,
		private dataSource: DataSourceConnection
	) {
		// repository port
		const orderRepository = this.dataSource.getRepository(OrderEntity);
		const bookRepository = this.dataSource.getRepository(OrderEntity);

		// persistence adapters
		const orderRepositoryAdapter = new OrderRepositoryDatabase(orderRepository);
		const bookRepositoryAdapter = new BookRepositoryDatabase(bookRepository);

		// client adapters
		const registerOrderAdapter = new RegisterOrderUseCase(
			orderRepositoryAdapter,
			bookRepositoryAdapter
		);
		const listOrdersAdapter = new ListOrdersUseCase(orderRepositoryAdapter);

		this.orderController = new OrderController(
			registerOrderAdapter,
			listOrdersAdapter
		);
	}

	expose() {
		this.router.post("/", this.orderController.create);
		this.router.get("/", this.orderController.list);
	}
}
