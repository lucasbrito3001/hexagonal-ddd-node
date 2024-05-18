import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { OrderEntity } from "./Order.entity";

@Entity("account")
export class AccountEntity {
	@PrimaryColumn("uuid")
	id?: string;
	@Column({ type: "varchar", length: 24 })
	firstName?: string;
	@Column({ type: "varchar", length: 24 })
	lastName?: string;
	@Column({ type: "varchar" })
	email?: string;
	@OneToMany(() => OrderEntity, (order) => order.user)
	orders?: OrderEntity;
}
