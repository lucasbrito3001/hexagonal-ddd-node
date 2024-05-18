import { z } from "zod";

export const ConfirmOrderItemReceptionInputSchema = z.object({
	orderItemId: z.string(),
});

export type ConfirmOrderItemReceptionInput = z.infer<
	typeof ConfirmOrderItemReceptionInputSchema
>;
