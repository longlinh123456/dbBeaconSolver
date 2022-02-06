import fs from "fs"
import {BeaconInfo} from "../../typings/beaconInfo"
const beaconInfo = JSON.parse(fs.readFileSync("./includes/beaconInfoDB/beaconInfo.json").toString()) as string[][][][][][][][]
export class BeaconInfoDB {
	static getSystemsMatchingBeaconInfo(info: BeaconInfo): string[] {
		return beaconInfo[info.A][info.B][info.F][info.G][info.K][info.M][info.N]
	}
}