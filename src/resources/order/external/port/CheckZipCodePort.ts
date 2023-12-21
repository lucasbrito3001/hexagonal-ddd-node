export class ZipCodeInfos {
	constructor(
		public zipCode: string,
		public street: string,
		public district: string,
		public city: string,
		public state: string
	) {}
}

export interface CheckZipCodePort {
	execute(zipCode: string): Promise<ZipCodeInfos | null>;
}
