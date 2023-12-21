import { beforeEach, describe, test } from "node:test";
import { deepEqual, ok } from "node:assert";
import { RegisterOrderUseCase } from "../usecase/adapter/RegisterOrderUseCase";
import { OrderMemoryRepository } from "../persistence/adapter/OrderMemoryRepository";
import { BookMemoryRepository } from "@/resources/book/persistence/adapter/BookMemoryRepository";
import { INPUT_ORDER } from "./constants";
import { Order } from "../domain/Order";
import { StockBookUseCase } from "@/resources/book/usecase/adapter/StockBookUseCase";
import { BookLocalFileStorage } from "@/resources/book/persistence/adapter/BookLocalFileStorage";
import { INPUT_BOOK } from "@/resources/book/test/contants";
import { OrderError } from "../OrderError";

describe("RegisterOrderUseCase", () => {
	let registerOrderUseCase: RegisterOrderUseCase;
	let stockBookUseCase: StockBookUseCase;
	let orderMemoryRepository: OrderMemoryRepository;
	let bookMemoryRepository: BookMemoryRepository;
	let bookLocalFileStorage: BookLocalFileStorage;

	beforeEach(() => {
		orderMemoryRepository = new OrderMemoryRepository();
		bookMemoryRepository = new BookMemoryRepository();
		bookLocalFileStorage = new BookLocalFileStorage();

		registerOrderUseCase = new RegisterOrderUseCase(
			orderMemoryRepository,
			bookMemoryRepository
		);
		stockBookUseCase = new StockBookUseCase(
			bookMemoryRepository,
			bookLocalFileStorage,
			() => "0-0-0-0-0"
		);
	});

	test("should register a new order successfully", async () => {
		await stockBookUseCase.execute(INPUT_BOOK);
		const order = await registerOrderUseCase.execute(INPUT_ORDER);

		ok(order instanceof Order);
	});

	test("should return BOOK_NOT_FOUND error", async () => {
		const orderOrError = await registerOrderUseCase.execute(INPUT_ORDER);

		deepEqual(orderOrError, new OrderError("BOOK_NOT_FOUND"));
	});

	test("should return BOOK_UNAVAILABLE error", async () => {
		await stockBookUseCase.execute({ ...INPUT_BOOK, isVisible: false });
		const orderOrError = await registerOrderUseCase.execute(INPUT_ORDER);

		deepEqual(orderOrError, new OrderError("BOOK_UNAVAILABLE"));
	});

	test("should return INVALID_DTO error", async () => {
		const orderOrError = await registerOrderUseCase.execute({
			...INPUT_ORDER,
			zipCode: "000",
		});

		deepEqual(orderOrError, new OrderError("INVALID_DTO"));
	});
});
