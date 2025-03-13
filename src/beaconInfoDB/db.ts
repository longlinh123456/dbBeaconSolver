import fs from "fs"
import {BeaconInfo} from "../../typings/beaconInfo"
const beaconInfo = JSON.parse(fs.readFileSync("./src/beaconInfoDB/beaconInfo.json").toString()) as string[][][][][][][]
export class BeaconInfoDB {
	static getSystemsMatchingBeaconInfo(info: BeaconInfo): string[] {
		return beaconInfo[info.A][info.BN][info.F][info.G][info.K][info.M]
	}
}