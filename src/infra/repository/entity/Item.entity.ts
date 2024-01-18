import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { OrderEntity } from "./Order.entity";

@Entity("item")
export class ItemEntity {
	@PrimaryColumn("uuid")
	id?: string;
	@Column({ type: "varchar" })
	unitPrice?: number;
}
