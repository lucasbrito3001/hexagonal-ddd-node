import { StockBookDTO } from "@/resources/book/controller/dto/StockBookDto";
import { Book } from "../../domain/Book";

export interface StockBookPort {
	execute(stockBookDTO: StockBookDTO): Promise<Book>;
}
