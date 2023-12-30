export type OrderBook = {
	id: string;
	quantity: number;
}[];

export class OrderRegistered {
	constructor(readonly orderId: string, readonly books: OrderBook) {}
}
