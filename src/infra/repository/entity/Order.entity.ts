import {
	Entity,
	Column,
	OneToMany,
	ManyToOne,
	PrimaryColumn,
	ColumnOptions,
} from "typeorm";
import { OrderItemEntity } from "./OrderItem.entity";
import { AccountEntity } from "./Account.entity";

export enum OrderStatus {
	PendingStockValidation = "PENDING_STOCK_VALIDATION",
	RejectedStockValidation = "REJECTED_STOCK_VALIDATION",
	PendingPaymentValidation = "PENDING_PAYMENT_VALIDATION",
	RejectedPaymentValidation = "REJECTED_PAYMENT_VALIDATION",
	Processing = "PROCESSING",
	Shipped = "SHIPPED",
	Completed = "COMPLETED",
	Canceled = "CANCELED",
}

const statusType =
	process.env.NODE_ENV === "e2e"
		? { type: "varchar" }
		: {
				type: "enum",
				enum: OrderStatus,
				default: OrderStatus.PendingStockValidation,
		  };

@Entity("order")
export class OrderEntity {
	@PrimaryColumn("uuid")
	id?: string;
	@ManyToOne(() => AccountEntity, (account) => account.orders, {
		nullable: false,
	})
	user?: string;
	@Column({ type: "decimal", precision: 10, scale: 0 })
	totalCost?: number;
	@Column(statusType as ColumnOptions)
	status?: OrderStatus;
	@Column({ type: "datetime" })
	createdAt?: string | Date;
	@OneToMany(() => OrderItemEntity, (orderItem) => orderItem.order, {
		cascade: true,
	})
	items?: OrderItemEntity[];
}
