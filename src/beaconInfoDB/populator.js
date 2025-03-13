"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../systemInfoDB/db");
const lodash_1 = __importDefault(require("lodash"));
const fs_1 = __importDefault(require("fs"));
const beaconInfo = [];
function getBeaconSystems(system) {
    const primaryNeighbors = db_1.NeighborInfoDB.getNeighbors(system);
    let secondaryNeighbors = [];
    primaryNeighbors.forEach((neighbor) => {
        secondaryNeighbors = lodash_1.default.union(secondaryNeighbors, db_1.NeighborInfoDB.getNeighbors(neighbor));
    });
    return lodash_1.default.union(primaryNeighbors, secondaryNeighbors, [system]);
}
function pushBeaconInfo(system, info) {
    beaconInfo[info.A] ??= [];
    beaconInfo[info.A][info.BN] ??= [];
    beaconInfo[info.A][info.BN][info.F] ??= [];
    beaconInfo[info.A][info.BN][info.F][info.G] ??= [];
    beaconInfo[info.A][info.BN][info.F][info.G][info.K] ??= [];
    beaconInfo[info.A][info.BN][info.F][info.G][info.K][info.M] ??= [];
    beaconInfo[info.A][info.BN][info.F][info.G][info.K][info.M].push(system);
}
db_1.SystemInfoDB.getAllSystems().forEach((system) => {
    const beaconNeighbors = getBeaconSystems(system);
    const neighborSpectralClasses = {
        A: [],
        B: [],
        F: [],
        G: [],
        K: [],
        M: [],
        N: []
    };
    beaconNeighbors.forEach((system) => {
        neighborSpectralClasses[db_1.SystemInfoDB.getSpectralClass(system)].push(system);
    });
    const neighborSpectralClassCounts = {
        A: 0,
        BN: 0,
        F: 0,
        G: 0,
        K: 0,
        M: 0
    };
    for (const spectralClass in neighborSpectralClasses) {
        if (spectralClass === "N" || spectralClass === "B") {
            neighborSpectralClassCounts["BN"] += neighborSpectralClasses[spectralClass].length;
        }
        else
            neighborSpectralClassCounts[spectralClass] = neighborSpectralClasses[spectralClass].length;
    }
    pushBeaconInfo(system, neighborSpectralClassCounts);
});
fs_1.default.writeFileSync("src/beaconInfoDB/beaconInfo.json", JSON.stringify(beaconInfo));
