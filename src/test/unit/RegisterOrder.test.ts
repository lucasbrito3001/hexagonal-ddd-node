import { beforeEach, describe, expect, test, vi } from "vitest";
import { RegisterOrder } from "@/application/usecase/RegisterOrder";
import { OrderMemoryRepository } from "../../infra/repository/mock/OrderMemoryRepository";
import { INPUT_ORDER } from "../constants";
import { MockQueue } from "@/infra/queue/mock/MockQueue";
import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { Queue } from "@/infra/queue/Queue";
import { OrderRegistered } from "@/domain/event/OrderRegistered";

describe("[Use Case - RegisterOrder]", () => {
	let registerOrder: RegisterOrder;
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
		const spyQueuePublish = vi.spyOn(mockQueue, "publish");

		const order = await registerOrder.execute(INPUT_ORDER, "0-0-0-0-0");

		expect(order.orderId).toBeDefined();
		expect(spyQueuePublish).toHaveBeenCalledWith(
			"orderRegistered",
			new OrderRegistered(order.orderId, [
				{
					quantity: INPUT_ORDER.items[0].quantity,
					itemId: mockGetResult[0].id,
				},
			])
		);
	});
});
