"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const screenshot_desktop_1 = __importDefault(require("screenshot-desktop"));
const express_1 = __importDefault(require("express"));
const opencv4nodejs_1 = __importDefault(require("@u4/opencv4nodejs"));
const jspngopt_1 = __importDefault(require("jspngopt"));
const fs_1 = __importDefault(require("fs"));
const db_1 = require("../systemInfoDB/db");
const cli_progress_1 = __importDefault(require("cli-progress"));
const app = (0, express_1.default)();
const compressor = new jspngopt_1.default.Optimizer();
function* systemGenerator() {
    const systems = db_1.SystemInfoDB.getAllSystems();
    for (const systemName of systems) {
        yield systemName;
    }
}
const systems = systemGenerator();
const bar = new cli_progress_1.default.SingleBar({
    format: "{value} of {total} images taken {bar} {percentage}%",
    hideCursor: true
}, cli_progress_1.default.Presets.shades_classic);
app.get("/", async (req, res) => {
    const { value: nextSystem } = systems.next();
    if (!req.query.systemName) {
        res.send(nextSystem);
        return;
    }
    const sourceImg = await (0, screenshot_desktop_1.default)({ format: "png" });
    const cropped = opencv4nodejs_1.default.imencode(".png", opencv4nodejs_1.default.imdecode(sourceImg, opencv4nodejs_1.default.IMREAD_UNCHANGED).getRegion(new opencv4nodejs_1.default.Rect(735, 332, 450, 451)));
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    await fs_1.default.promises.writeFile(`./beaconImages/${req.query.systemName}.png`, compressor.bufferSync(cropped));
    bar.increment();
    if (nextSystem) {
        res.send(nextSystem);
    }
    else {
        res.send("END");
        bar.stop();
        process.exit();
    }
});
app.listen(80, () => {
    bar.start(db_1.SystemInfoDB.getAllSystems().length, 0);
});
