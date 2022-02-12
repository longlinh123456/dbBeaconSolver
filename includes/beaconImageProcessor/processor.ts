import cv2, {Mat} from "opencv4nodejs-prebuilt"
import {BeaconInfo} from "../../typings/beaconInfo"
const BGRSpectralClasses = {
	BN: new cv2.Vec3(255, 200, 100),
	A: new cv2.Vec3(255, 230, 200),
	F: new cv2.Vec3(210, 245, 255),
	G: new cv2.Vec3(120, 240, 255),
	K: new cv2.Vec3(80, 165, 255),
	M: new cv2.Vec3(60, 80, 255),
}
const leniencyVector = new cv2.Vec3(17, 17, 12)
export class BeaconProcessor {
	static detectSpectralClassSignature(img: Mat): BeaconInfo {
		const filteredImgs: Record<string, Mat> = {}
		const spectralClassCounts: BeaconInfo = {
			A: 0,
			BN: 0,
			F: 0,
			G: 0,
			K: 0,
			M: 0
		}
		for (const spectralClass in BGRSpectralClasses) {
			filteredImgs[spectralClass] = img.bitwiseAnd(img.inRange(BGRSpectralClasses[spectralClass].sub(leniencyVector), BGRSpectralClasses[spectralClass].add(leniencyVector)).cvtColor(cv2.COLOR_GRAY2BGR))
		}
		for (const spectralClass in filteredImgs) {
			spectralClassCounts[spectralClass] = filteredImgs[spectralClass].cvtColor(cv2.COLOR_BGR2GRAY).threshold(25, 255, cv2.THRESH_BINARY).findContours(cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE).length
		}
		return spectralClassCounts
	}
}