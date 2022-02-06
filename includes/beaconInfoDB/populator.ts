import {SystemInfoDB, NeighborInfoDB} from "../systemInfoDB/db"
import {BeaconInfo} from "../../typings/beaconInfo"
import _ from "lodash"
import fs from "fs"
import {SpectralClass} from "../../typings/systemInfo"
const beaconInfo: string[][][][][][][][] = []
function getBeaconSystems(system: string): string[] {
	const primaryNeighbors = NeighborInfoDB.getNeighbors(system)
	let secondaryNeighbors: string[] = []
	primaryNeighbors.forEach((neighbor) => {
		secondaryNeighbors = _.union(secondaryNeighbors, NeighborInfoDB.getNeighbors(neighbor))
	})
	return _.union(primaryNeighbors, secondaryNeighbors, [system])
}
function pushBeaconInfo(system: string, info: BeaconInfo) {
	beaconInfo[info.A] ??= []
	beaconInfo[info.A][info.B] ??= []
	beaconInfo[info.A][info.B][info.F] ??= []
	beaconInfo[info.A][info.B][info.F][info.G] ??= []
	beaconInfo[info.A][info.B][info.F][info.G][info.K] ??= []
	beaconInfo[info.A][info.B][info.F][info.G][info.K][info.M] ??= []
	beaconInfo[info.A][info.B][info.F][info.G][info.K][info.M][info.N] ??= []
	beaconInfo[info.A][info.B][info.F][info.G][info.K][info.M][info.N].push(system)
}
SystemInfoDB.getAllSystems().forEach((system) => {
	const beaconNeighbors = getBeaconSystems(system)
	const neighborSpectralClasses: Record<SpectralClass, SpectralClass[]> = {
		A: [],
		B: [],
		F: [],
		G: [],
		K: [],
		M: [],
		N: []
	}
	beaconNeighbors.forEach((system) => {
		neighborSpectralClasses[SystemInfoDB.getSpectralClass(system)].push(system as SpectralClass)
	})
	const neighborSpectralClassCounts = {} as BeaconInfo
	for (const spectralClass in neighborSpectralClasses) {
		neighborSpectralClassCounts[spectralClass] = neighborSpectralClasses[spectralClass].length
	}
	console.log(neighborSpectralClassCounts)
	pushBeaconInfo(system, neighborSpectralClassCounts)
})
fs.writeFileSync("includes/beaconInfoDB/beaconInfo.json", JSON.stringify(beaconInfo))