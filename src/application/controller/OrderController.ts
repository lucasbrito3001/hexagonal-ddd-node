import { RegisterOrderDTO } from "./dto/RegisterOrderDto";
import { OrderError } from "../../error/OrderError";
import { Request, Response } from "express";
import { RegisterOrderPort } from "@/application/usecase/interfaces/RegisterOrderPort";
import { ListOrdersPort } from "@/application/usecase/interfaces/ListOrdersPort";
import { UnexpectedError } from "@/error/ErrorBase";
import { DependencyRegistry } from "@/infra/DependencyRegistry";

export class OrderController {
	private readonly registerOrder: RegisterOrderPort;
	private readonly listOrders: ListOrdersPort;

	constructor(readonly registry: DependencyRegistry) {
		this.registerOrder = registry.inject("registerOrder");
		this.listOrders = registry.inject("listOrders");
	}

	create = async (req: Request, res: Response): Promise<any> => {
		try {
			const registerOrderDTO: RegisterOrderDTO = req.body;
			const orderOrError = await this.registerOrder.execute(registerOrderDTO);

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
				const { httpCode, ...error } = new OrderError("REQUIRED_DATE_RANGE");
				res.status(httpCode).json(error);
			}

			const ordersOrError = await this.listOrders.execute(
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
