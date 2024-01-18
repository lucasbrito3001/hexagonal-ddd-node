import {
	Entity,
	Column,
	OneToMany,
	ManyToOne,
	PrimaryColumn,
	ColumnOptions,
} from "typeorm";
import { OrderItemEntity } from "./OrderItem.entity";
import { UserEntity } from "./User.entity";

export enum OrderStatus {
	Pending = "PENDING",
	Processing = "PROCESSING",
	Shipped = "SHIPPED",
	Delivered = "DELIVERED",
	PaymentApproved = "PAYMENT_APPROVED",
	PaymentRejected = "PAYMENT_REJECTED",
	ItemsApproved = "ITEMS_APPROVED",
	ItemsRejected = "ITEMS_REJECTED",
	Canceled = "CANCELED",
}

export enum OrderPaymentMethods {
	CreditCard = "CREDIT_CARD",
	Pix = "PIX",
	Billet = "BANK_SLIP",
}

const statusType =
	process.env.NODE_ENV === "e2e"
		? { type: "varchar" }
		: { type: "enum", enum: OrderStatus, default: OrderStatus.Pending };

const orderPaymentsType =
	process.env.NODE_ENV === "e2e"
		? { type: "varchar" }
		: { type: "enum", enum: OrderPaymentMethods };

@Entity("order")
export class OrderEntity {
	@PrimaryColumn("uuid")
	id?: string;
	@ManyToOne(() => UserEntity, (user) => user.orders, { nullable: false })
	user?: string;
	@Column({ type: "decimal", precision: 10, scale: 0 })
	totalCost?: number;
	@Column(statusType as ColumnOptions)
	status?: OrderStatus;
	@Column(orderPaymentsType as ColumnOptions)
	paymentMethod?: OrderPaymentMethods;
	@Column({ type: "datetime" })
	createdAt?: string | Date;
	@OneToMany(() => OrderItemEntity, (orderItem) => orderItem.order, {
		cascade: true,
	})
	items?: OrderItemEntity[];
}
