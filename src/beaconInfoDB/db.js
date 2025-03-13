"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeaconInfoDB = void 0;
const fs_1 = __importDefault(require("fs"));
const beaconInfo = JSON.parse(fs_1.default.readFileSync("./src/beaconInfoDB/beaconInfo.json").toString());
class BeaconInfoDB {
    static getSystemsMatchingBeaconInfo(info) {
        return beaconInfo[info.A][info.BN][info.F][info.G][info.K][info.M];
    }
}
exports.BeaconInfoDB = BeaconInfoDB;
