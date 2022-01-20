"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const opencv4nodejs_1 = __importDefault(require("opencv4nodejs"));
const sharp_1 = __importDefault(require("sharp"));
const fs_1 = __importDefault(require("fs"));
(async () => {
    const marker = await (0, sharp_1.default)(fs_1.default.readFileSync("./beaconAssets/marker.png")).resize(350, 350).flatten().png().toBuffer();
    const markerMat = opencv4nodejs_1.default.imdecode(marker);
    const multiplier = new opencv4nodejs_1.default.Mat(350, 350, opencv4nodejs_1.default.CV_8UC3, [60, 80, 255]);
    const RMarker = markerMat.hMul(multiplier);
    opencv4nodejs_1.default.imshowWait("eg", RMarker);
    const systemDot = await (0, sharp_1.default)(fs_1.default.readFileSync("./beaconAssets/systemDot.png")).resize(8, 8).toBuffer();
    const composited = (0, sharp_1.default)({
        create: {
            width: 359,
            height: 359,
            channels: 3,
            background: { r: 0, g: 0, b: 0 }
        }
    })
        .composite([
    //{input: RMarker, blend: "lighten"},
    //{input: systemDot, blend: "lighten"}
    ])
        .png();
    opencv4nodejs_1.default.imshowWait("bruh", opencv4nodejs_1.default.imdecode(await composited.toBuffer()));
})();
