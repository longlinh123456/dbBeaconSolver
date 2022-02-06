"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NeighborInfoDB = exports.SystemInfoDB = void 0;
const fs_1 = __importDefault(require("fs"));
const systemInfo = JSON.parse(fs_1.default.readFileSync("./includes/systemInfoDB/systemInfo.json").toString());
const neighborInfo = JSON.parse(fs_1.default.readFileSync("./includes/systemInfoDB/neighborInfo.json").toString());
class SystemInfoDB {
    static getSpectralClass(systemName) {
        return systemInfo[systemName];
    }
    static getAllSystems() {
        return Object.keys(systemInfo);
    }
}
exports.SystemInfoDB = SystemInfoDB;
class NeighborInfoDB {
    static getNeighbors(systemname) {
        return neighborInfo[systemname];
    }
}
exports.NeighborInfoDB = NeighborInfoDB;
