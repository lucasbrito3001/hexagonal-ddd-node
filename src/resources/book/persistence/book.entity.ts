import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("book")
export class BookEntity {
	@PrimaryGeneratedColumn("uuid")
	id?: string;

	@Column()
	title?: string;

    @Column()
    edition?: number;

	@Column()
	author?: string;

	@Column()
	release?: string;

	@Column()
	cover?: string;

	@Column()
	quantity?: number;

	@Column()
	isVisible?: boolean;
}
