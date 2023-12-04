import { BookController } from "@/resources/book/controller/book.controller";
import { Router } from "express";

export class BooksRoutes {
	private bookController: BookController;

	constructor(public router: Router) {}

	expose() {
		this.router.post("/", this.bookController.stock);
	}
}
