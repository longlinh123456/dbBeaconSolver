import fs from "fs"
import {Solver} from "./includes/solver"
async function check(beacon: string) {
	const img = fs.readFileSync(`./beaconImages/${beacon}`)
	if ((await Solver.solve(img))[0] !== beacon.slice(0, -4)) {
		console.log(`Result mismatch at system ${beacon.slice(0, -4)}`)
	}
}
const beaconNames = fs.readdirSync("./beaconImages")
for (const beacon of beaconNames) {
	check(beacon)
}