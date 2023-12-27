import { BookEntity } from "@/resources/book/persistence/book.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from "typeorm";

@Entity("order")
export class OrderEntity {
	@PrimaryColumn("uuid")
	id?: string;

	@Column({ type: "varchar" })
	country?: string;

	@Column({ type: "varchar" })
	state?: string;

	@Column({ type: "varchar" })
	city?: string;

	@Column({ type: "varchar" })
	district?: string;

	@Column({ type: "varchar" })
	street?: string;

	@Column({ type: "int" })
	number?: number;

	@Column({ type: "varchar" })
	complement?: string;

	@Column({ type: "varchar" })
	zipCode?: string;

	@ManyToMany(() => BookEntity)
	@JoinTable()
	books?: BookEntity[];
}
