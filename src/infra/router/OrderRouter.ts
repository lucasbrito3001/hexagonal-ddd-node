import { Router } from "express";
import { OrderController } from "@/application/controller/OrderController";
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
