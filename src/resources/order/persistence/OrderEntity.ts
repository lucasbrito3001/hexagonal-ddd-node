import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
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

	@Column()
	books?: string[];
}
