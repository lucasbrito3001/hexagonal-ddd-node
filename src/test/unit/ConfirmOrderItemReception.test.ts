import { ConfirmOrderItemReceptionInput } from "@/application/controller/dto/ConfirmOrderItemReceptionInput";
import { OrderItemRepository } from "@/application/repository/OrderItemRepository";
import {
	ConfirmOrderItemReception,
	ConfirmOrderItemReceptionOutput,
	ConfirmOrderItemReceptionPort,
} from "@/application/usecase/ConfirmOrderItemReception";
import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { OrderItemMemoryRepository } from "@/infra/repository/mock/OrderItemMemoryRepository";
import { beforeEach, describe, expect, test } from "vitest";
import { MockInputConfirmOrderItemReception } from "../constants";
import { OrderItemNotFoundError } from "@/error/OrderItemError";
import { OrderItem } from "@/domain/entities/OrderItem";
import { DeliveryStatus } from "@/infra/repository/entity/OrderItem.entity";

describe("[Use Case - ConfirmOrderItemReception]", () => {
	const registry = new DependencyRegistry();

	let orderItemRepository: OrderItemRepository;
	let confirmOrderItemReception: ConfirmOrderItemReceptionPort;

	beforeEach(() => {
		orderItemRepository = new OrderItemMemoryRepository();
		registry.push("orderItemRepository", orderItemRepository);

		confirmOrderItemReception = new ConfirmOrderItemReception(registry);
	});

	test("should throw OrderItemNotFoundError when try to confirm an order item that not exists", () => {
		const input: ConfirmOrderItemReceptionInput =
			new MockInputConfirmOrderItemReception();

		const fn = () => confirmOrderItemReception.execute(input);

		expect(fn).rejects.toBeInstanceOf(OrderItemNotFoundError);
	});

	test("should confirm the order item reception successfully", async () => {
		const input: ConfirmOrderItemReceptionInput =
			new MockInputConfirmOrderItemReception();

		await orderItemRepository.save(
			OrderItem.instance(
				input.orderItemId,
				"0",
				"0",
				1,
				0,
				DeliveryStatus.OutForDelivery
			)
		);

		const output = await confirmOrderItemReception.execute(input);

		expect(output).toBeInstanceOf(ConfirmOrderItemReceptionOutput);
	});
});
