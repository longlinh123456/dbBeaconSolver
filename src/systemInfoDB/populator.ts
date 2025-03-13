import {Instance, RobloxXMLParser} from "roblox-xml-parser"
import fs from "fs"
import cliProgress from "cli-progress"
import {SpectralClass} from "../../typings/systemInfo"
const systemPointers = {}
function getChildren(parent: Instance, childrenName: string): Instance {
	return parent.children.find(children => children.properties.Name.value === childrenName) as Instance
}
(async() => {
	const systemInfo: Record<string, SpectralClass> = {}
	const parsed = new RobloxXMLParser
	await parsed.parse(await fs.promises.readFile("Starscape_ The Citadel.rbxlx", "utf-8"))
	const sectors = getChildren(getChildren(getChildren(parsed.dataModel, "ReplicatedStorage"), "System"), "Sectors").children
	let systemCount = 0
	sectors.forEach(systemInfos => systemCount += systemInfos.children.length)
	const systemBar = new cliProgress.SingleBar({
		format: "{value} of {total} systems processed {bar} {percentage}%",
		hideCursor: true
	}, cliProgress.Presets.shades_classic)
	systemBar.start(systemCount, 0)
	sectors.forEach(systemInfos => systemInfos.children.forEach(systemInfo => {
		systemInfo[systemInfo.properties.Name.value] = getChildren(systemInfo, "SpectralClass").properties.Value.value
		systemPointers[systemInfo.referent] = systemInfo.properties.Name.value
		systemBar.increment()
	}))
	systemBar.stop()
	const linkInfo = {}
	const links = getChildren(getChildren(getChildren(parsed.dataModel, "ReplicatedStorage"), "System"), "Links").children
	const linkBar = new cliProgress.SingleBar({
		format: "{value} of {total} links processed {bar} {percentage}%",
		hideCursor: true
	}, cliProgress.Presets.shades_classic)
	linkBar.start(links.length, 0)
	links.forEach(link => {
		linkInfo[systemPointers[getChildren(link, "Start").properties.Value.value]] ??= []
		linkInfo[systemPointers[getChildren(link, "End").properties.Value.value]] ??= []
		linkInfo[systemPointers[getChildren(link, "Start").properties.Value.value]].push(systemPointers[getChildren(link, "End").properties.Value.value])
		linkInfo[systemPointers[getChildren(link, "End").properties.Value.value]].push(systemPointers[getChildren(link, "Start").properties.Value.value])
		linkBar.increment()
	})
	linkBar.stop()
	fs.writeFileSync("src/systemInfoDB/systemInfo.json", JSON.stringify(systemInfo))
	fs.writeFileSync("src/systemInfoDB/neighborInfo.json", JSON.stringify(linkInfo))
})()