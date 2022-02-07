import {SpectralClassDetector} from "./beaconImageProcessor/processor"
import {BeaconInfoDB} from "./beaconInfoDB/db"
import cv2 from "opencv4nodejs-prebuilt"
import fs from "fs"
export class Solver {
	static async solve(beaconImg: Buffer): Promise<string[]> {
		const img = cv2.imdecode(beaconImg)
		const detectedBeaconInfo = SpectralClassDetector.detect(img)
		const potentialMatchingSystems = BeaconInfoDB.getSystemsMatchingBeaconInfo(detectedBeaconInfo)
		if (potentialMatchingSystems.length <= 1) return potentialMatchingSystems
		else {
			const promises = potentialMatchingSystems.map(async(systemName) => {
				let systemImg = cv2.imdecode(await fs.promises.readFile(`./beaconImages/${systemName}.png`))
				systemImg = systemImg.copyMakeBorder(200, 200, 200, 200, cv2.BORDER_CONSTANT, new cv2.Vec3(0, 0, 0))
				return {
					name: systemName,
					confidence: cv2.minMaxLoc(systemImg.matchTemplate(img, cv2.TM_CCOEFF)).maxVal
				}
			})
			const results = await Promise.all(promises)
			return results.sort((a, b) => b.confidence - a.confidence).map(result => result.name)
		}
	}
}