import { Router } from "express";
import { OrderController } from "@/application/controller/OrderController";
import { ListOrders } from "@/application/usecase/ListOrders";
import { RegisterOrder } from "@/application/usecase/RegisterOrder";
import { OrderRepositoryDatabase } from "../repository/OrderDatabaseRepository";
import { DataSourceConnection } from "../DataSource";
import { OrderEntity } from "../repository/entity/OrderEntity";
import { BookRepositoryDatabase } from "../repository/BookDatabaseRepository";
import { DependencyRegistry } from "../DependencyRegistry";

export class OrderRouter {
	private orderController: OrderController;

	constructor(private router: Router, readonly registry: DependencyRegistry) {
		this.orderController = new OrderController(registry);
	}

	expose() {
		this.router.post("/register_order", this.orderController.create);
		this.router.get("/list_orders", this.orderController.list);
	}
}
