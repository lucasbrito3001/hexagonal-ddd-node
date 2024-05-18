import { randomUUID } from "node:crypto";
import { RegisterOrderDTO } from "@/application/controller/dto/RegisterOrderDto";
import { OrderStatus } from "@/infra/repository/entity/Order.entity";
import { OrderItem } from "./OrderItem";

export class Order {
	private constructor(
		public id: string,
		public user: string,
		public items: OrderItem[],
		public status: OrderStatus,
		public totalCost: number,
		public createdAt: string
	) {}

	static register = (
		registerOrderDTO: RegisterOrderDTO,
		user: string,
		idGenerator: () => `${string}-${string}-${string}-${string}-${string}` = randomUUID
	): Order => {
		const id = idGenerator();
		const createdAt = new Date().toISOString();

		const totalCost = registerOrderDTO.items.reduce((acc, item) => {
			return (acc += (item.unitPrice || 0) * item.quantity);
		}, 0);

		const orderItems = registerOrderDTO.items.map((item) => {
			return OrderItem.register(
				id,
				item.itemId,
				item.quantity,
				+(item.unitPrice || 0)
			);
		});

		const order = new Order(
			id,
			user,
			orderItems,
			OrderStatus.PendingStockValidation,
			totalCost,
			createdAt
		);

		return order;
	};

	static instance = (
		id: string,
		user: string,
		items: OrderItem[],
		status: OrderStatus,
		totalCost: number,
		createdAt: string
	) => {
		return new Order(id, user, items || [], status, totalCost, createdAt);
	};

	static approveOrderItems = (order: Order) => {
		const status = OrderStatus.PendingPaymentValidation;
		return new Order(
			order.id,
			order.user,
			order.items,
			status,
			order.totalCost,
			order.createdAt
		);
	};

	static rejectOrderItems = (order: Order) => {
		const status = OrderStatus.RejectedStockValidation;
		return new Order(
			order.id,
			order.user,
			order.items,
			status,
			order.totalCost,
			order.createdAt
		);
	};

	static approvePayment = (order: Order) => {
		const status = OrderStatus.Processing;
		return new Order(
			order.id,
			order.user,
			order.items,
			status,
			order.totalCost,
			order.createdAt
		);
	};

	static rejectPayment = (order: Order) => {
		const status = OrderStatus.RejectedPaymentValidation;
		return new Order(
			order.id,
			order.user,
			order.items,
			status,
			order.totalCost,
			order.createdAt
		);
	};
}
