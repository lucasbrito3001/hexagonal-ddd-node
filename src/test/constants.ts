import { RegisterOrderDTO } from "@/application/controller/dto/RegisterOrderDto";

export class MockInputOrder {
	public items: RegisterOrderDTO["items"];

	constructor(input?: RegisterOrderDTO) {
		this.items = input?.items || [{ itemId: "0-0-0-0-0", quantity: 2 }];
	}
}

export class MockInputUser {
	constructor(
		public id = "3a5e8426-8265-418b-9ade-a82d0f69ec42",
		public firstName = "John",
		public lastName = "Doe",
		public email = "john@doe.com",
		public orders = []
	) {}
}

export class MockInputConfirmOrderItemReception {
	constructor(
		public orderItemId = "0-0-0-0-0",
	) {}
}
