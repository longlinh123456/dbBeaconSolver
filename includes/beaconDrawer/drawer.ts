import cv2, {Mat, Vec2} from "opencv4nodejs"
import sharp from "sharp"
import fs from "fs"
import {SystemInfoDB, NeighborInfoDB} from "../systemInfoGetter/db"
import {SpectralClass} from "../../typings/systemInfo"
function putOnCanvas(pictureToPut: Mat, canvas: Mat, position: Vec2) {
	const verticalParity = pictureToPut.sizes[0] % 2
	const horizontalParity = pictureToPut.sizes[1] % 2
	pictureToPut.copyMakeBorder(position.y - Math.ceil(pictureToPut.sizes[0] / 2),
		Math.floor(canvas.sizes[0] / 2),
		Math.ceil(canvas.sizes[1] / 2),
		Math.floor(canvas.sizes[1] / 2),
		cv2.BORDER_CONSTANT, new cv2.Vec3(0, 0, 0))
}
function stampSystem(systemClass: SpectralClass, canvas: Mat) {
	const bg = canvas.convertTo(cv2.CV_32FC3, 1.0 / 255)
	let fg = cv2.imread(`./beaconAssets/${systemClass}System.png`)
	fg = fg
		.convertTo(cv2.CV_32FC3, 1.0 / 255)
	const mask = cv2.imread("./mask.jpg").convertTo(cv2.CV_32FC3, 1.0 / 255)
	const allOnes = new cv2.Mat(mask.rows, mask.cols, cv2.CV_32FC3, [1.0, 1.0, 1.0])

	const invMask = allOnes.sub(mask)
	return mask.hMul(fg).add(invMask.hMul(bg))
}
(async() => {
	const marker = await sharp(fs.readFileSync("./beaconAssets/marker.png")).resize(350, 350).flatten().png().toBuffer()
	const markerMat = cv2.imdecode(marker)
	const multiplier = new cv2.Mat(350, 350, cv2.CV_8UC3, [60, 80, 255])
	const RMarker = markerMat.hMul(multiplier)
	cv2.imshowWait("eg", RMarker)
	const systemDot = await sharp(fs.readFileSync("./beaconAssets/systemDot.png")).resize(8, 8).toBuffer()
	const composited = sharp({
		create: {
			width: 359,
			height: 359,
			channels: 3,
			background: {r: 0, g: 0, b: 0}
		}
	})
		.composite([
			//{input: RMarker, blend: "lighten"},

			//{input: systemDot, blend: "lighten"}
		])
		.png()
	cv2.imshowWait("bruh", cv2.imdecode(await composited.toBuffer()))
})()