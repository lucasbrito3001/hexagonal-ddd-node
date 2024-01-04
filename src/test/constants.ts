import { RegisterOrderDTO } from "@/application/controller/dto/RegisterOrderDto";
import { OrderPaymentMethods } from "@/infra/repository/entity/OrderEntity";

export const INPUT_ORDER: RegisterOrderDTO = {
	items: [{ itemId: "0-0-0-0-0", quantity: 2 }],
	paymentMethod: OrderPaymentMethods.CreditCard,
};
