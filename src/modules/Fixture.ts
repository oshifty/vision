import type * as UDR from '../lib/udr.next';

export class Fixture {
	myID: number;
	definition: UDR.Device;

	constructor(myID: number, definition: UDR.Device) {
		this.myID = myID;
		this.definition = definition;
	}
}
