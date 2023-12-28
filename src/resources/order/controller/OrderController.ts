import { UnexpectedError } from "@/resources/ErrorBase";
import { RegisterOrderDTO } from "./dto/RegisterOrderDto";
import { RegisterOrderPort } from "../usecase/port/RegisterOrderPort";
import { OrderError } from "../OrderError";
import { Request, Response } from "express";
import { ListOrdersPort } from "../usecase/port/ListOrdersPort";

export class OrderController {
	constructor(
		private readonly registerOrderUseCase: RegisterOrderPort,
		private readonly listOrderUseCase: ListOrdersPort
	) {}

	create = async (req: Request, res: Response): Promise<any> => {
		try {
			const registerOrderDTO: RegisterOrderDTO = req.body;
			const orderOrError = await this.registerOrderUseCase.execute(
				registerOrderDTO
			);

			if (orderOrError instanceof OrderError) {
				const { httpCode, ...errorMessage } = orderOrError;
				return res.status(httpCode).json(errorMessage);
			}

			return res.status(201).json(orderOrError);
		} catch (error) {
			console.log(error);

			const { httpCode, ...unexpectedErrorMessage } = new UnexpectedError();
			return res.status(httpCode).json(unexpectedErrorMessage);
		}
	};

	list = async (req: Request, res: Response): Promise<any> => {
		try {
			const { startDate, endDate } = req.query;

			if (!startDate || !endDate) {
				const { httpCode, ...error } = new OrderError("INVALID_DATE_RANGE");
				res.status(httpCode).json(error);
			}

			const ordersOrError = await this.listOrderUseCase.execute(
				new Date(startDate as string),
				new Date(endDate as string)
			);

			if (ordersOrError instanceof OrderError) {
				const { httpCode, ...error } = ordersOrError;
				return res.status(httpCode).json(error);
			}

			res.status(200).json(ordersOrError);
		} catch (error) {
			console.log(error);

			const { httpCode, ...unexpectedErrorMessage } = new UnexpectedError();
			return res.status(httpCode).json(unexpectedErrorMessage);
		}
	};
}
