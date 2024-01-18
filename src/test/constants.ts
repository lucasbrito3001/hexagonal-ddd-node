import { RegisterOrderDTO } from "@/application/controller/dto/RegisterOrderDto";
import { OrderPaymentMethods } from "@/infra/repository/entity/Order.entity";

export const INPUT_ORDER: RegisterOrderDTO = {
	items: [{ itemId: "0-0-0-0-0", quantity: 2 }],
	paymentMethod: OrderPaymentMethods.CreditCard,
};

export const INPUT_USER = {
	id: "3a5e8426-8265-418b-9ade-a82d0f69ec42",
	first_name: "John",
	last_name: "Doe",
	email: "john@doe.com",
	orders: [],
};

// @PrimaryColumn("uuid")
// 	id?: string;
// 	@Column({ type: "varchar", length: 24 })
// 	first_name?: string;
// 	@Column({ type: "varchar", length: 24 })
// 	last_name?: string;
// 	@Column({ type: "varchar" })
// 	email?: string;
// 	@OneToMany(() => OrderEntity, (order) => order.user)
// 	orders?: OrderEntity;
