import { StockBookPort } from "../usecase/port/StockBookPort";
import { StockBookDTO } from "./dto/StockBookDto";
import { BookError } from "../BookResult";
import { UnexpectedError } from "@/resources/ErrorBase";
import { Request, Response } from "express";
import { GetStockedBooksPort } from "../usecase/port/GetStockedBooksPort";

export class BookController {
	constructor(
		private readonly stockBookUseCase: StockBookPort,
		private readonly getStockedBooksUseCase: GetStockedBooksPort
	) {}

	stock = async (req: Request, res: Response): Promise<any> => {
		try {
			const stockBookDTO: StockBookDTO = req.body;
			const bookOrError = await this.stockBookUseCase.execute(stockBookDTO);

			if (bookOrError instanceof BookError) {
				const { httpCode, ...errorMessage } = bookOrError;
				return res.status(httpCode).json(errorMessage);
			}

			return res.status(201).json(bookOrError);
		} catch (error) {
			console.log(error);

			const { httpCode, ...unexpectedErrorMessage } = new UnexpectedError();
			return res.status(httpCode).json(unexpectedErrorMessage);
		}
	};

	search = async (req: Request, res: Response): Promise<any> => {
		try {
			const { title } = req.query;

			const booksOrError = await this.getStockedBooksUseCase.execute(
				title as string
			);

			if (booksOrError instanceof BookError) {
				const { httpCode, ...errorMessage } = booksOrError;

				return res.status(httpCode).json(errorMessage);
			}

			res.json(booksOrError);
		} catch (error) {
			console.log(error);
			
			const { httpCode, ...unexpectedErrorMessage } = new UnexpectedError();
			return res.status(httpCode).json(unexpectedErrorMessage);
		}
	};
}
