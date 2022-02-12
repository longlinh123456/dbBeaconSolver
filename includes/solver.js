"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Solver = void 0;
const processor_1 = require("./beaconImageProcessor/processor");
const db_1 = require("./beaconInfoDB/db");
const opencv4nodejs_prebuilt_1 = __importDefault(require("opencv4nodejs-prebuilt"));
const fs_1 = __importDefault(require("fs"));
class Solver {
    static async solve(beaconImg) {
        const img = opencv4nodejs_prebuilt_1.default.imdecode(beaconImg);
        const detectedBeaconInfo = processor_1.BeaconProcessor.detectSpectralClassSignature(img);
        const potentialMatchingSystems = db_1.BeaconInfoDB.getSystemsMatchingBeaconInfo(detectedBeaconInfo);
        if (potentialMatchingSystems.length <= 1)
            return potentialMatchingSystems;
        else {
            const promises = potentialMatchingSystems.map(async (systemName) => {
                let systemImg = opencv4nodejs_prebuilt_1.default.imdecode(await fs_1.default.promises.readFile(`./beaconImages/${systemName}.png`));
                systemImg = systemImg.copyMakeBorder(200, 200, 200, 200, opencv4nodejs_prebuilt_1.default.BORDER_CONSTANT, new opencv4nodejs_prebuilt_1.default.Vec3(0, 0, 0));
                return {
                    name: systemName,
                    confidence: opencv4nodejs_prebuilt_1.default.minMaxLoc(systemImg.matchTemplate(img, opencv4nodejs_prebuilt_1.default.TM_CCOEFF)).maxVal
                };
            });
            const results = await Promise.all(promises);
            return results.sort((a, b) => b.confidence - a.confidence).map(result => result.name);
        }
    }
}
exports.Solver = Solver;
