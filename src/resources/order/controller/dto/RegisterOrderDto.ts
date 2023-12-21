import { z } from "zod";

export const RegisterOrderDTOSchema = z.object({
	country: z.string(),
	state: z.string(),
	district: z.string(),
	city: z.string(),
	street: z.string(),
	number: z.number(),
	complement: z.string(),
	zipCode: z.string().length(8),
	books: z.array(z.string()),
});

export type RegisterOrderDTO = z.infer<typeof RegisterOrderDTOSchema>;
