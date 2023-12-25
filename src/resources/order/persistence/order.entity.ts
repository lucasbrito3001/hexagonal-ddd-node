import { BookEntity } from "@/resources/book/persistence/book.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from "typeorm";

@Entity("order")
export class OrderEntity {
	@PrimaryColumn("uuid")
	id?: string;

	@Column()
	country?: string;

	@Column()
	state?: string;

	@Column()
	city?: string;

	@Column()
	district?: string;

	@Column()
	street?: string;

	@Column()
	number?: number;

	@Column()
	complement?: string;

	@Column()
	zipCode?: string;

	@ManyToMany(() => BookEntity)
	@JoinTable()
	books?: BookEntity[];
}
