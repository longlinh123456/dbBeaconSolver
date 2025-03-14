"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeaconProcessor = void 0;
const opencv4nodejs_1 = __importDefault(require("@u4/opencv4nodejs"));
const BGRSpectralClasses = {
    BN: [255, 200, 100],
    A: [255, 230, 200],
    F: [210, 245, 255],
    G: [120, 240, 255],
    K: [80, 165, 255],
    M: [60, 80, 255],
};
const leniencyVector = new opencv4nodejs_1.default.Vec3(15, 15, 11);
for (const spectralClass in BGRSpectralClasses) {
    BGRSpectralClasses[spectralClass] = new opencv4nodejs_1.default.Mat(1, 1, opencv4nodejs_1.default.CV_8UC3, BGRSpectralClasses[spectralClass]).cvtColor(opencv4nodejs_1.default.COLOR_BGR2HSV_FULL).at(1, 1);
}
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
        const hsv_img = img.cvtColor(opencv4nodejs_1.default.COLOR_BGR2HSV_FULL);
        for (const spectralClass in BGRSpectralClasses) {
            filteredImgs[spectralClass] = hsv_img.bitwiseAnd(hsv_img.inRange(BGRSpectralClasses[spectralClass].sub(leniencyVector), BGRSpectralClasses[spectralClass].add(leniencyVector)).cvtColor(opencv4nodejs_1.default.COLOR_GRAY2BGR));
        }
        for (const spectralClass in filteredImgs) {
            spectralClassCounts[spectralClass] = filteredImgs[spectralClass].cvtColor(opencv4nodejs_1.default.COLOR_BGR2GRAY).threshold(25, 255, opencv4nodejs_1.default.THRESH_BINARY).findContours(opencv4nodejs_1.default.RETR_TREE, opencv4nodejs_1.default.CHAIN_APPROX_SIMPLE).length;
        }
        return spectralClassCounts;
    }
}
exports.BeaconProcessor = BeaconProcessor;
