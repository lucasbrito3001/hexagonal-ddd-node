import { OrderController } from "@/application/controller/OrderController";
import { DependencyRegistry } from "../DependencyRegistry";
import { Router } from "express";
import { TokenMiddleware } from "@/application/middleware/TokenMiddleware";

export class OrderRouter {
	private orderController: OrderController;
	private tokenMiddleware: TokenMiddleware;

	constructor(private router: Router, readonly registry: DependencyRegistry) {
		this.orderController = new OrderController(registry);
		this.tokenMiddleware = new TokenMiddleware(registry);
	}

	expose() {
		this.router.post(
			"/register_order",
			this.tokenMiddleware.validateAndDecodeToken,
			this.orderController.register
		);
		this.router.get("/list_orders", this.orderController.list);
		this.router.put(
			"/confirm_order_item_reception",
			this.orderController.confirmReception
		);
	}
}
