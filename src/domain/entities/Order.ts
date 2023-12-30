import { ZodError } from "zod";
import { randomUUID } from "node:crypto";
import {
	RegisterOrderDTO,
	RegisterOrderDTOSchema,
} from "@/application/controller/dto/RegisterOrderDto";

export class Order {
	private constructor(
		public id: string,
		public country: string,
		public state: string,
		public city: string,
		public district: string,
		public street: string,
		public number: number,
		public complement: string,
		public zipCode: string,
		public books: string[],
		public createdAt: Date
	) {}

	static register = (
		registerOrderDTO: RegisterOrderDTO,
		idGenerator: () => `${string}-${string}-${string}-${string}-${string}` = randomUUID
	): Order => {
		const id = idGenerator();
		const createdAt = new Date();

		const order = new Order(
			id,
			registerOrderDTO.country,
			registerOrderDTO.state,
			registerOrderDTO.district,
			registerOrderDTO.city,
			registerOrderDTO.street,
			registerOrderDTO.number,
			registerOrderDTO.complement,
			registerOrderDTO.zipCode,
			registerOrderDTO.books,
			createdAt
		);

		return order;
	};
}
