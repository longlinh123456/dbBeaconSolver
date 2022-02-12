"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const solver_1 = require("./includes/solver");
const cli_progress_1 = __importDefault(require("cli-progress"));
(async () => {
    const beaconNames = fs_1.default.readdirSync("./beaconSamples");
    const bar = new cli_progress_1.default.SingleBar({
        format: "{value} of {total} systems tested {bar} {percentage}%",
        hideCursor: true
    }, cli_progress_1.default.Presets.shades_classic);
    bar.start(beaconNames.length, 0);
    for (const beacon of beaconNames) {
        try {
            const img = fs_1.default.readFileSync(`./beaconSamples/${beacon}`);
            if ((await solver_1.Solver.solve(img))[0] !== beacon.slice(0, -4)) {
                console.log(`\nResult mismatch at system ${beacon.slice(0, -4)}`);
            }
            bar.increment();
        }
        catch {
            console.log(`Error at system ${beacon.slice(0, -4)}`);
        }
    }
})();
