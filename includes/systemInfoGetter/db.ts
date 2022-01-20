import fs from "fs"
import {SystemInfo} from "../../typings/systemInfo"
const systemInfo = JSON.parse(fs.readFileSync("includes/systemInfoGetter/systemInfo.json").toString())
const neighborInfo = JSON.parse(fs.readFileSync("includes/systemInfoGetter/neighborInfo.json").toString())
export class SystemInfoDB {
	static get(systemName: string): SystemInfo {
		return systemInfo.infoFromNames[systemName]
	}
	static getSystemFromIdentifier(identifier: string): SystemInfo {
		return systemInfo.infoFromIdentifier[identifier]
	}
}
export class NeighborInfoDB {
	static get(systemname: string): string[] {
		return neighborInfo[systemname]
	}
}