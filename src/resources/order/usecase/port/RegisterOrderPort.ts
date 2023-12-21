import { OrderError } from "../../OrderError";
import { RegisterOrderDTO } from "../../controller/dto/RegisterOrderDto";
import { Order } from "../../domain/Order";

export interface RegisterOrderPort {
	execute(registerOrderDTO: RegisterOrderDTO): Promise<Order | OrderError>;
}
