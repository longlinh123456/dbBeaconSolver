"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const processor_1 = require("./processor");
const opencv4nodejs_1 = __importDefault(require("opencv4nodejs"));
for (const sample of fs_1.default.readdirSync("./sampleBeacons")) {
    const imgFile = fs_1.default.readFileSync(`./sampleBeacons/${sample}`);
    opencv4nodejs_1.default.imshow(sample, opencv4nodejs_1.default.imdecode(imgFile));
    console.log(processor_1.SpectralClassDetector.detect(imgFile));
    opencv4nodejs_1.default.waitKey();
    opencv4nodejs_1.default.destroyAllWindows();
}
