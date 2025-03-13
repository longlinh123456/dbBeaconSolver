import cv2, {Mat} from "@u4/opencv4nodejs"
import {BeaconInfo} from "../../typings/beaconInfo"
const BGRSpectralClasses = {
	BN: [255, 200, 100],
	A: [255, 230, 200],
	F: [210, 245, 255],
	G: [120, 240, 255],
	K: [80, 165, 255],
	M: [60, 80, 255],
}
const leniencyVector = new cv2.Vec3(15, 15, 11)
for (const spectralClass in BGRSpectralClasses) {
	BGRSpectralClasses[spectralClass] = new cv2.Mat(1, 1, cv2.CV_8UC3, BGRSpectralClasses[spectralClass]).cvtColor(cv2.COLOR_BGR2HSV_FULL).at(1, 1)
}
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
		const hsv_img = img.cvtColor(cv2.COLOR_BGR2HSV_FULL)
		for (const spectralClass in BGRSpectralClasses) {
			filteredImgs[spectralClass] = hsv_img.bitwiseAnd(hsv_img.inRange(BGRSpectralClasses[spectralClass].sub(leniencyVector), BGRSpectralClasses[spectralClass].add(leniencyVector)).cvtColor(cv2.COLOR_GRAY2BGR))
		}
		for (const spectralClass in filteredImgs) {
			spectralClassCounts[spectralClass] = filteredImgs[spectralClass].cvtColor(cv2.COLOR_BGR2GRAY).threshold(25, 255, cv2.THRESH_BINARY).findContours(cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE).length
		}
		return spectralClassCounts
	}
}