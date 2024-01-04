import { OrderPaymentMethods } from "@/infra/repository/entity/OrderEntity";
import { z } from "zod";

export const RegisterOrderDTOSchema = z.object({
	items: z.array(
		z.object({
			itemId: z.string(),
			quantity: z.number().min(1),
			unitPrice: z.number().optional(),
		})
	),
	paymentMethod: z.nativeEnum(OrderPaymentMethods),
});

export type RegisterOrderDTO = z.infer<typeof RegisterOrderDTOSchema>;
