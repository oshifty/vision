import * as UDR from "../libraries/udr.next";

export class Fixture {
	myID: Number;
	definition: UDR.Device;

	constructor(myID: Number, definition: UDR.Device) {
		this.myID = myID;
		this.definition = definition;
	}
}
