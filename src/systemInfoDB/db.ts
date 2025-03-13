import fs from "fs"
import {SpectralClass} from "../../typings/systemInfo"
const systemInfo = JSON.parse(fs.readFileSync("./src/systemInfoDB/systemInfo.json").toString()) as Record<string, SpectralClass>
const neighborInfo = JSON.parse(fs.readFileSync("./src/systemInfoDB/neighborInfo.json").toString()) as Record<string, string[]>
export class SystemInfoDB {
	static getSpectralClass(systemName: string): SpectralClass {
		return systemInfo[systemName]
	}
	static getAllSystems(): string[] {
		return Object.keys(systemInfo)
	}
}
export class NeighborInfoDB {
	static getNeighbors(systemname: string): string[] {
		return neighborInfo[systemname]
	}
}