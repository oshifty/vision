import * as UDR from "./udr";
import { IExtend } from "../interfaces/IExtend";
export * from "./udr";

export interface Device extends UDR.Device, IExtend {
	anotherTest: string;
}
