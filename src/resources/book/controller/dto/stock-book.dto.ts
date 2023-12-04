import { z } from "zod";

export const StockBookDTOSchema = z.object({
	title: z.string(),
	edition: z.number().nonnegative(),
	author: z.string(),
	release: z.string().datetime(),
	cover: z.string().url(),
	quantity: z.number().nonnegative(),
});

export type StockBookDTO = z.infer<typeof StockBookDTOSchema>;
