import { beforeEach, describe, expect, test, vi } from "vitest";
import {
	RegisterOrder,
	RegisterOrderPort,
} from "@/application/usecase/RegisterOrder";
import { OrderMemoryRepository } from "../../infra/repository/mock/OrderMemoryRepository";
import { MockInputOrder } from "../constants";
import { MockQueue } from "@/infra/queue/mock/MockQueue";
import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { Queue } from "@/infra/queue/Queue";
import { OrderRegistered } from "@/domain/event/OrderRegistered";
import { OrderItem } from "@/domain/entities/OrderItem";

describe("[Use Case - RegisterOrder]", () => {
	let registerOrder: RegisterOrderPort;
	let mockQueue: Queue;
	const mockGetResult = [{ id: "0-0-0-0-0", unitPrice: 100 }];

	beforeEach(() => {
		const registry = new DependencyRegistry();
		mockQueue = new MockQueue();

		registry.push("orderRepository", new OrderMemoryRepository());
		registry.push("itemRepository", {
			get: () => mockGetResult,
		});
		registry.push("queue", mockQueue);

		registerOrder = new RegisterOrder(registry);
	});

	test("should register a new order successfully", async () => {
		const input = new MockInputOrder();
		const spyQueuePublish = vi.spyOn(mockQueue, "publish");

		const order = await registerOrder.execute(
			new MockInputOrder(),
			"0-0-0-0-0"
		);

		expect(order.orderId).toBeDefined();
		expect(spyQueuePublish.mock.calls[0][0]).toBeInstanceOf(OrderRegistered);
	});
});
