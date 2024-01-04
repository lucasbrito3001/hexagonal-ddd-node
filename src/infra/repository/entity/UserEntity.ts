import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { OrderEntity } from "./OrderEntity";

@Entity("user")
export class UserEntity {
	@PrimaryColumn("uuid")
	id?: string;
	@Column({ type: "varchar" })
	name?: string;
	@Column({ type: "varchar" })
	email?: string;
	@OneToMany(() => OrderEntity, (order) => order.user)
	orders?: OrderEntity;
}
