import {
	Column,
	ColumnOptions,
	Entity,
	ManyToOne,
	PrimaryColumn,
} from "typeorm";
import { OrderEntity } from "./Order.entity";

export enum DeliveryStatus {
	Pending = "PENDING",
	Processing = "PROCESSING",
	Shipped = "SHIPPED",
	OutForDelivery = "OUT_FOR_DELIVERY",
	Delivered = "DELIVERED",
	FailedDeliveryAttempt = "FAILED_DELIVERY_ATTEMPT",
	Returned = "RETURNED",
	Cancelled = "CANCELLED",
}

const deliveryStatus =
	process.env.NODE_ENV === "e2e"
		? { type: "varchar" }
		: { type: "enum", enum: DeliveryStatus, default: DeliveryStatus.Pending };

@Entity("order_item")
export class OrderItemEntity {
	@PrimaryColumn("uuid")
	id?: string;
	@Column("uuid")
	itemId?: string;
	@Column({ type: "int" })
	quantity?: number;
	@Column({ type: "decimal", precision: 6, scale: 2 })
	unitPrice?: number;
	@Column(deliveryStatus as ColumnOptions)
	deliveryStatus?: string;
	@ManyToOne(() => OrderEntity, (orderEntity) => orderEntity.items)
	order?: OrderEntity;
}
