import { randomUUID } from "node:crypto";
import { RegisterOrderDTO } from "@/application/controller/dto/RegisterOrderDto";
import {
	OrderPaymentMethods,
	OrderStatus,
} from "@/infra/repository/entity/Order.entity";
import { OrderItem } from "./OrderItem";

export class Order {
	private constructor(
		public id: string,
		public user: string,
		public items: OrderItem[],
		public status: OrderStatus,
		public paymentMethod: OrderPaymentMethods,
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
			OrderStatus.Pending,
			registerOrderDTO.paymentMethod,
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
		paymentMethod: OrderPaymentMethods,
		totalCost: number,
		createdAt: string
	) => {
		return new Order(
			id,
			user,
			items || [],
			status,
			paymentMethod,
			totalCost,
			createdAt
		);
	};

	static approveOrderItems = (order: Order) => {
		const status = OrderStatus.ItemsApproved;
		return new Order(
			order.id,
			order.user,
			order.items,
			status,
			order.paymentMethod,
			order.totalCost,
			order.createdAt
		);
	};

	static rejectOrderItems = (order: Order) => {
		const status = OrderStatus.ItemsRejected;
		return new Order(
			order.id,
			order.user,
			order.items,
			status,
			order.paymentMethod,
			order.totalCost,
			order.createdAt
		);
	};

	static approvePayment = (order: Order) => {
		const status = OrderStatus.PaymentApproved;
		return new Order(
			order.id,
			order.user,
			order.items,
			status,
			order.paymentMethod,
			order.totalCost,
			order.createdAt
		);
	};
}
