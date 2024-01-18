import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { OrderEntity } from "./Order.entity";

@Entity("order_item")
export class OrderItemEntity {
	@PrimaryColumn("uuid")
	id?: string;
	@ManyToOne(() => OrderEntity, (orderEntity) => orderEntity.items)
	order?: OrderEntity;
	@Column("uuid")
	itemId?: string;
	@Column({ type: "int" })
	quantity?: number;
	@Column({ type: "decimal", precision: 6, scale: 2 })
	unitPrice?: number;
}
