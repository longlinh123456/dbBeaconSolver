import {Instance, RobloxXMLParser} from "roblox-xml-parser"
import fs from "fs"
import util from "util"
import cliProgress from "cli-progress"
function getChildren(parent: Instance, childrenName: string): Instance {
	return parent.children.find(children => children.properties.Name.value === childrenName) as Instance
}
function resolveObjectPointer(dataModel: Instance, pointer: string): Instance {
	return dataModel.getDescendants().find(instance => instance.referent === pointer) as Instance
}
(async() => {
	const parsed = new RobloxXMLParser
	const linkList: Record<string, string[]> = {}
	await parsed.parse(await fs.promises.readFile("./robloxPlaceBackup.rbxlx", "utf-8"))
	const links = getChildren(getChildren(getChildren(parsed.dataModel, "Workspace"), "GalaxyMap"), "Links")
	const bar = new cliProgress.SingleBar({
		format: "{value} of {total} links processed {bar} {percentage}%",
		hideCursor: true
	}, cliProgress.Presets.shades_classic)
	bar.start(links.children.length, 0)
	links.children.forEach(link => {
		let start = ""
		let end = ""
		link.children.forEach(value => {
			if (value.properties.Name.value === "Start") start = resolveObjectPointer(parsed.dataModel, value.properties.Value.value).properties.Name.value
			if (value.properties.Name.value === "End") end = resolveObjectPointer(parsed.dataModel, value.properties.Value.value).properties.Name.value
		})
		linkList[start] ??= []
		linkList[end] ??= []
		linkList[start].push(end)
		linkList[end].push(start)
		bar.increment()
	})
	bar.stop()
	fs.writeFileSync("./links.json", JSON.stringify(linkList))
})()