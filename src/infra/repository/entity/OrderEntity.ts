import { Entity, Column, OneToMany, ManyToOne, PrimaryColumn } from "typeorm";
import { OrderItemEntity } from "./OrderItemEntity";
import { UserEntity } from "./UserEntity";

export enum OrderStatus {
	Pending = "PENDING",
	Processing = "PROCESSING",
	Shipped = "SHIPPED",
	Delivered = "DELIVERED",
	Canceled = "CANCELED",
}

export enum OrderPaymentMethods {
	CreditCard = "CREDIT_CARD",
	Pix = "PIX",
	Billet = "BANK_SLIP",
}

@Entity("order")
export class OrderEntity {
	@PrimaryColumn("uuid")
	id?: string;
	@ManyToOne(() => UserEntity, (user) => user.orders, { nullable: false })
	user?: string;
	@Column({ type: "decimal", precision: 10, scale: 2 })
	totalCost?: number;
	@Column({ type: "enum", enum: OrderStatus, default: OrderStatus.Pending })
	status?: OrderStatus;
	@Column({ type: "enum", enum: OrderPaymentMethods })
	paymentMethod?: OrderPaymentMethods;
	@Column({ type: "datetime" })
	createdAt?: string | Date;
	@OneToMany(() => OrderItemEntity, (orderItem) => orderItem.order, {
		cascade: true,
	})
	items?: OrderItemEntity[];
}
