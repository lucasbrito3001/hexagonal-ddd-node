import { randomUUID } from "node:crypto";
import { RegisterOrderDTO } from "@/application/controller/dto/RegisterOrderDto";
import {
	OrderPaymentMethods,
	OrderStatus,
} from "@/infra/repository/entity/OrderEntity";
import { OrderItems } from "../event/OrderRegistered";
import { OrderItem } from "./OrderItem";

export class Order {
	constructor(
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
}
