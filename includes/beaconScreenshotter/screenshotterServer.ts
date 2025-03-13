import screenshot from "screenshot-desktop"
import express from "express"
import cv2 from "opencv4nodejs-prebuilt"
import jspngopt from "jspngopt"
import fs from "fs"
import {SystemInfoDB} from "../systemInfoDB/db"
import cliProgress from "cli-progress"
const app = express()
const compressor = new jspngopt.Optimizer()
function* systemGenerator() {
	const systems = SystemInfoDB.getAllSystems()
	for (const systemName of systems) {
		yield systemName
	}
}
const systems = systemGenerator()
const bar = new cliProgress.SingleBar({
	format: "{value} of {total} images taken {bar} {percentage}%",
	hideCursor: true
}, cliProgress.Presets.shades_classic)
app.get("/", async(req, res) => {
	const {value: nextSystem} = systems.next()
	if (!req.query.systemName) {
		res.send(nextSystem)
		return
	}
	const sourceImg = await screenshot({format: "png"})
	const cropped = cv2.imencode(".png", cv2.imdecode(sourceImg, cv2.IMREAD_UNCHANGED).getRegion(new cv2.Rect(735, 332, 450, 451)))
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	fs.writeFile(`./beaconImages/${req.query.systemName}.png`, compressor.bufferSync(cropped), () => {})
	bar.increment()
	if (nextSystem) {
		res.send(nextSystem)
	} else {
		res.send("END")
		bar.stop()
		process.exit()
	}
})
app.listen(80, () => {
	bar.start(SystemInfoDB.getAllSystems().length, 0)
})