import { ReqBody } from "@/application/decorators/reqBody.decorator";
import { UnexpectedError } from "@/resources/error";
import { RegisterOrderDTO } from "./dto/RegisterOrderDto";
import { RegisterOrderPort } from "../usecase/port/RegisterOrderPort";
import { OrderError } from "../OrderError";
import { Order } from "../domain/Order";

export class OrderController {
	constructor(private readonly registerOrderUseCase: RegisterOrderPort) {}

	async stock(
		@ReqBody() registerOrderDTO: RegisterOrderDTO
	): Promise<Order | OrderError | UnexpectedError> {
		const book = await this.registerOrderUseCase.execute(registerOrderDTO);
		return book;
	}
}
