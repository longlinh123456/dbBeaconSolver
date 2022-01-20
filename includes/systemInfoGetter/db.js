"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NeighborInfoDB = exports.SystemInfoDB = void 0;
const fs_1 = __importDefault(require("fs"));
const systemInfo = JSON.parse(fs_1.default.readFileSync("includes/systemInfoGetter/systemInfo.json").toString());
const neighborInfo = JSON.parse(fs_1.default.readFileSync("includes/systemInfoGetter/neighborInfo.json").toString());
class SystemInfoDB {
    static get(systemName) {
        return systemInfo.infoFromNames[systemName];
    }
    static getSystemFromIdentifier(identifier) {
        return systemInfo.infoFromIdentifier[identifier];
    }
}
exports.SystemInfoDB = SystemInfoDB;
class NeighborInfoDB {
    static get(systemname) {
        return neighborInfo[systemname];
    }
}
exports.NeighborInfoDB = NeighborInfoDB;
