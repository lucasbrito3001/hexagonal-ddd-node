import { BookRepositoryPort } from "@/resources/book/persistence/port/BookRepositoryPort";
import { OrderError } from "../../OrderError";
import { RegisterOrderDTO } from "../../controller/dto/RegisterOrderDto";
import { Order } from "../../domain/Order";
import { OrderRepositoryPort } from "../../persistence/port/OrderRepositoryPort";
import { RegisterOrderPort } from "../port/RegisterOrderPort";
import { ZodError } from "zod";

export class RegisterOrderUseCase implements RegisterOrderPort {
	constructor(
		private readonly orderRepository: OrderRepositoryPort,
		private readonly bookRepository: BookRepositoryPort
	) {}

	async execute(
		registerOrderDTO: RegisterOrderDTO
	): Promise<Order | OrderError> {
		const orderOrError = Order.register(registerOrderDTO);

		if (orderOrError instanceof ZodError) return new OrderError("INVALID_DTO");

		const bookEntities = await this.bookRepository.searchByIds(
			registerOrderDTO.books
		);

		if (bookEntities.length !== registerOrderDTO.books.length)
			return new OrderError("BOOK_NOT_FOUND");

		if (bookEntities.some((book) => !book.isVisible || !book.quantity))
			return new OrderError("BOOK_UNAVAILABLE");

		await this.orderRepository.save(orderOrError);

		return orderOrError;
	}
}
