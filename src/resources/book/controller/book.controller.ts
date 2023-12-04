import { ReqBody } from "@/application/decorators/reqBody.decorator";
import { StockBookPort } from "../port/stock-book.port";
import { StockBookDTO } from "./dto/stock-book.dto";

export class BookController {
	constructor(private readonly stockBookUseCase: StockBookPort) {}

	async stock(@ReqBody() stockBookDTO: StockBookDTO): Promise<boolean> {
		await this.stockBookUseCase.execute(stockBookDTO);
		return true;
	}
}
