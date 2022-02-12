import fs from "fs"
import {Solver} from "./includes/solver"
import cliProgress from "cli-progress"
(async() => {
	const beaconNames = fs.readdirSync("./beaconSamples")
	const bar = new cliProgress.SingleBar({
		format: "{value} of {total} systems tested {bar} {percentage}%",
		hideCursor: true
	}, cliProgress.Presets.shades_classic)
	bar.start(beaconNames.length, 0)
	for (const beacon of beaconNames) {
		try {
			const img = fs.readFileSync(`./beaconSamples/${beacon}`)
			if ((await Solver.solve(img))[0] !== beacon.slice(0, -4)) {
				console.log(`\nResult mismatch at system ${beacon.slice(0, -4)}`)
			}
			bar.increment()
		}
		catch {
			console.log(`\nError at system ${beacon.slice(0, -4)}`)
		}
	}
	bar.stop()
})()