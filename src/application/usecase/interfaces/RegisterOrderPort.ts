import { RegisterOrderDTO } from "@/application/controller/dto/RegisterOrderDto";
import { Output } from "../RegisterOrder";

export interface RegisterOrderPort {
	execute(registerOrderDTO: RegisterOrderDTO, userId: string): Promise<Output>;
}
