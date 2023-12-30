import { RegisterOrderDTO } from "@/application/controller/dto/RegisterOrderDto";
import { Order } from "@/domain/entities/Order";
import { OrderError } from "@/error/OrderError";
import { Output } from "../RegisterOrder";

export interface RegisterOrderPort {
	execute(registerOrderDTO: RegisterOrderDTO): Promise<Output | void>;
}
