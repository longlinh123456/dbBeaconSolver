"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const roblox_xml_parser_1 = require("roblox-xml-parser");
const fs_1 = __importDefault(require("fs"));
const cli_progress_1 = __importDefault(require("cli-progress"));
const systemPointers = {};
function getChildren(parent, childrenName) {
    return parent.children.find(children => children.properties.Name.value === childrenName);
}
(async () => {
    const infoFromNames = {};
    const infoFromIdentifier = {};
    const parsed = new roblox_xml_parser_1.RobloxXMLParser;
    await parsed.parse(await fs_1.default.promises.readFile("Starscape_ The Citadel.rbxlx", "utf-8"));
    const sectors = getChildren(getChildren(getChildren(parsed.dataModel, "ReplicatedStorage"), "System"), "Sectors").children;
    let systemCount = 0;
    sectors.forEach(systemInfos => systemCount += systemInfos.children.length);
    const systemBar = new cli_progress_1.default.SingleBar({
        format: "{value} of {total} systems processed {bar} {percentage}%",
        hideCursor: true
    }, cli_progress_1.default.Presets.shades_classic);
    systemBar.start(systemCount, 0);
    sectors.forEach(systemInfos => systemInfos.children.forEach(systemInfo => {
        infoFromNames[systemInfo.properties.Name.value] = {
            position: {
                X: Number(systemInfo.properties.Value.value.X),
                Y: Number(systemInfo.properties.Value.value.Y),
                Z: Number(systemInfo.properties.Value.value.Z)
            },
            identifier: getChildren(systemInfo, "Identifier").properties.Value.value,
            spectralClass: getChildren(systemInfo, "SpectralClass").properties.Value.value
        };
        infoFromIdentifier[getChildren(systemInfo, "Identifier").properties.Value.value] = {
            position: {
                X: Number(systemInfo.properties.Value.value.X),
                Y: Number(systemInfo.properties.Value.value.Y),
                Z: Number(systemInfo.properties.Value.value.Z)
            },
            identifier: getChildren(systemInfo, "Identifier").properties.Value.value,
            spectralClass: getChildren(systemInfo, "SpectralClass").properties.Value.value
        };
        systemPointers[systemInfo.referent] = systemInfo.properties.Name.value;
        systemBar.increment();
    }));
    systemBar.stop();
    const linkList = {};
    const links = getChildren(getChildren(getChildren(parsed.dataModel, "ReplicatedStorage"), "System"), "Links").children;
    const linkBar = new cli_progress_1.default.SingleBar({
        format: "{value} of {total} links processed {bar} {percentage}%",
        hideCursor: true
    }, cli_progress_1.default.Presets.shades_classic);
    linkBar.start(links.length, 0);
    links.forEach(link => {
        var _a, _b;
        linkList[_a = systemPointers[getChildren(link, "Start").properties.Value.value]] ?? (linkList[_a] = []);
        linkList[_b = systemPointers[getChildren(link, "End").properties.Value.value]] ?? (linkList[_b] = []);
        linkList[systemPointers[getChildren(link, "Start").properties.Value.value]].push(systemPointers[getChildren(link, "End").properties.Value.value]);
        linkList[systemPointers[getChildren(link, "End").properties.Value.value]].push(systemPointers[getChildren(link, "Start").properties.Value.value]);
        linkBar.increment();
    });
    linkBar.stop();
    fs_1.default.writeFileSync("includes/systemInfoGetter/systemInfo.json", JSON.stringify({ infoFromNames: infoFromNames, infoFromIdentifier: infoFromIdentifier }));
    fs_1.default.writeFileSync("includes/systemInfoGetter/neighborInfo.json", JSON.stringify(linkList));
})();
