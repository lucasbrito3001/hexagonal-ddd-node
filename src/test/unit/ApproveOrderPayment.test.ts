import { OrderRepository } from "@/application/repository/OrderRepository";
import { ApproveOrderPayment } from "@/application/usecase/ApproveOrderPayment";
import { Order } from "@/domain/entities/Order";
import { OrderPaymentApproved } from "@/domain/event/OrderPaymentApproved";
import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { OrderMemoryRepository } from "@/infra/repository/mock/OrderMemoryRepository";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { INPUT_ORDER } from "../constants";
import { OrderStatus } from "@/infra/repository/entity/Order.entity";
import { OrderNotFoundError } from "@/error/OrderError";

describe("[Use Case - ApproveOrderPayment]", () => {
	const registry = new DependencyRegistry();

	let orderRepository: OrderRepository;
	let approveOrderPayment: ApproveOrderPayment;

	beforeEach(() => {
		orderRepository = new OrderMemoryRepository();
		registry.push("orderRepository", orderRepository);

		approveOrderPayment = new ApproveOrderPayment(registry);
	});

	test("should update the order status to PAYMENT_APPROVED", async () => {
		await orderRepository.save(
			Order.register(INPUT_ORDER, "0-0-0-0-0", () => "0-0-0-0-0")
		);

		expect(
			approveOrderPayment.execute(new OrderPaymentApproved("0-0-0-0-0"))
		).resolves.not.toThrow();
	});

	test("should throw OrderNotFoundError when the orderId not exists", async () => {
		const fn = () =>
			approveOrderPayment.execute(new OrderPaymentApproved("0-0-0-0-0"));

		expect(fn).rejects.toBeInstanceOf(OrderNotFoundError)
	});
});