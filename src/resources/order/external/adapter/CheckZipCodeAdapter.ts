import { CheckZipCodePort, ZipCodeInfos } from "../port/CheckZipCodePort";
import { AxiosInstance } from "axios";

type OpenCepReturn = {
	cep: string;
	logradouro: string;
	complemento: string;
	bairro: string;
	localidade: string;
	uf: string;
	ibge: string;
};

export class CheckZipCodeAdapter implements CheckZipCodePort {
	constructor(private readonly httpClient: AxiosInstance) {}

	execute = async (zipCode: string) => {
		try {
			const { data }: { data: OpenCepReturn } = await this.httpClient.get(
				`https://opencep.com/v1/${zipCode}`
			);

			return new ZipCodeInfos(
				data.cep,
				data.logradouro,
				data.bairro,
				data.localidade,
				data.uf
			);
		} catch (error) {
			return null;
		}
	};
}
