import { RegisterOrderDTO } from "../controller/dto/RegisterOrderDto";

export const INPUT_ORDER: RegisterOrderDTO = {
	country: "Mock Country",
	state: "MS",
	city: "Mock City",
	district: "Mock District",
	street: "Mock Street",
	number: 100,
	complement: "apto. 100",
	zipCode: "00000000",
	books: ["0-0-0-0-0"],
};
