"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const solver_1 = require("./includes/solver");
async function check(beacon) {
    const img = fs_1.default.readFileSync(`./beaconImages/${beacon}`);
    if ((await solver_1.Solver.solve(img))[0] !== beacon.slice(0, -4)) {
        console.log(`Result mismatch at system ${beacon.slice(0, -4)}`);
    }
}
const beaconNames = fs_1.default.readdirSync("./beaconImages");
for (const beacon of beaconNames) {
    check(beacon);
}
