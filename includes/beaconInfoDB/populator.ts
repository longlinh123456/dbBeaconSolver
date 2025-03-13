import {SystemInfoDB, NeighborInfoDB} from "../systemInfoDB/db"
import {BeaconInfo} from "../../typings/beaconInfo"
import _ from "lodash"
import fs from "fs"
import {SpectralClass} from "../../typings/systemInfo"
const beaconInfo: string[][][][][][][] = []
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
	beaconInfo[info.A][info.BN] ??= []
	beaconInfo[info.A][info.BN][info.F] ??= []
	beaconInfo[info.A][info.BN][info.F][info.G] ??= []
	beaconInfo[info.A][info.BN][info.F][info.G][info.K] ??= []
	beaconInfo[info.A][info.BN][info.F][info.G][info.K][info.M] ??= []
	beaconInfo[info.A][info.BN][info.F][info.G][info.K][info.M].push(system)
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
	const neighborSpectralClassCounts: BeaconInfo = {
		A: 0,
		BN: 0,
		F: 0,
		G: 0,
		K: 0,
		M: 0
	}
	for (const spectralClass in neighborSpectralClasses) {
		if (spectralClass === "N" || spectralClass === "B") {
			neighborSpectralClassCounts["BN"] += neighborSpectralClasses[spectralClass].length
		} else neighborSpectralClassCounts[spectralClass] = neighborSpectralClasses[spectralClass].length
	}
	pushBeaconInfo(system, neighborSpectralClassCounts)
})
fs.writeFileSync("includes/beaconInfoDB/beaconInfo.json", JSON.stringify(beaconInfo))