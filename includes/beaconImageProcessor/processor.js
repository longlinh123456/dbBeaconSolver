"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeaconProcessor = void 0;
const opencv4nodejs_prebuilt_1 = __importDefault(require("opencv4nodejs-prebuilt"));
const BGRSpectralClasses = {
    BN: new opencv4nodejs_prebuilt_1.default.Vec3(255, 200, 100),
    A: new opencv4nodejs_prebuilt_1.default.Vec3(255, 230, 200),
    F: new opencv4nodejs_prebuilt_1.default.Vec3(210, 245, 255),
    G: new opencv4nodejs_prebuilt_1.default.Vec3(120, 240, 255),
    K: new opencv4nodejs_prebuilt_1.default.Vec3(80, 165, 255),
    M: new opencv4nodejs_prebuilt_1.default.Vec3(60, 80, 255),
};
const leniencyVector = new opencv4nodejs_prebuilt_1.default.Vec3(10, 10, 10);
class BeaconProcessor {
    static detectSpectralClassSignature(img) {
        const filteredImgs = {};
        const spectralClassCounts = {
            A: 0,
            BN: 0,
            F: 0,
            G: 0,
            K: 0,
            M: 0
        };
        for (const spectralClass in BGRSpectralClasses) {
            filteredImgs[spectralClass] = img.bitwiseAnd(img.inRange(BGRSpectralClasses[spectralClass].sub(leniencyVector), BGRSpectralClasses[spectralClass].add(leniencyVector)).cvtColor(opencv4nodejs_prebuilt_1.default.COLOR_GRAY2BGR));
        }
        for (const spectralClass in filteredImgs) {
            spectralClassCounts[spectralClass] = filteredImgs[spectralClass].cvtColor(opencv4nodejs_prebuilt_1.default.COLOR_BGR2GRAY).threshold(15, 255, opencv4nodejs_prebuilt_1.default.THRESH_BINARY).findContours(opencv4nodejs_prebuilt_1.default.RETR_TREE, opencv4nodejs_prebuilt_1.default.CHAIN_APPROX_SIMPLE).length;
        }
        return spectralClassCounts;
    }
}
exports.BeaconProcessor = BeaconProcessor;
