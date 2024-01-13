import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { OrderEntity } from "./OrderEntity";

@Entity("user")
export class UserEntity {
	@PrimaryColumn("uuid")
	id?: string;
	@Column({ type: "varchar", length: 24 })
	first_name?: string;
	@Column({ type: "varchar", length: 24 })
	last_name?: string;
	@Column({ type: "varchar" })
	email?: string;
	@OneToMany(() => OrderEntity, (order) => order.user)
	orders?: OrderEntity;
}
