import type * as GDTF from 'gdtf-types';
import type * as UDR from '../lib/udr.next';

/**
 * A controllable device that is used in a show.
 */
export class Fixture {
	myID: number;
	definition: UDR.Device | GDTF.FixtureType;

	constructor(myID: number, definition: UDR.Device | GDTF.FixtureType) {
		this.myID = myID;
		this.definition = definition;
	}
}
