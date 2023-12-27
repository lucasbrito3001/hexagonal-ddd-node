export function ReqBody() {
	return function (target: any, propertyKey: string, index: number) {
		console.log(target, propertyKey, index, "000");
	};
}
