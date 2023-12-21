import { ZodError } from "zod";
import {
	RegisterOrderDTO,
	RegisterOrderDTOSchema,
} from "../controller/dto/RegisterOrderDto";
import { randomUUID } from "node:crypto";

export class Order {
	constructor(
		public id: string,
		public country: string,
		public state: string,
		public city: string,
		public district: string,
		public street: string,
		public number: number,
		public complement: string,
		public zipCode: string,
		public books: string[]
	) {}

	static register = (
		registerOrderDTO: RegisterOrderDTO,
		idGenerator: () => `${string}-${string}-${string}-${string}-${string}` = randomUUID
	): Order | ZodError => {
		const parse = RegisterOrderDTOSchema.safeParse(registerOrderDTO);

		const id = idGenerator();

		if (!parse.success) return parse.error;

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
			registerOrderDTO.books
		);

		return order;
	};
}
