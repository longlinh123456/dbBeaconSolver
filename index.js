"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const roblox_xml_parser_1 = require("roblox-xml-parser");
const fs_1 = __importDefault(require("fs"));
const cli_progress_1 = __importDefault(require("cli-progress"));
function getChildren(parent, childrenName) {
    return parent.children.find(children => children.properties.Name.value === childrenName);
}
function resolveObjectPointer(dataModel, pointer) {
    return dataModel.getDescendants().find(instance => instance.referent === pointer);
}
(async () => {
    const parsed = new roblox_xml_parser_1.RobloxXMLParser;
    const linkList = {};
    await parsed.parse(await fs_1.default.promises.readFile("./robloxPlaceBackup.rbxlx", "utf-8"));
    const links = getChildren(getChildren(getChildren(parsed.dataModel, "Workspace"), "GalaxyMap"), "Links");
    const bar = new cli_progress_1.default.SingleBar({
        format: "{value} of {total} links processed {bar} {percentage}%",
        hideCursor: true
    }, cli_progress_1.default.Presets.shades_classic);
    bar.start(links.children.length, 0);
    links.children.forEach(link => {
        let start = "";
        let end = "";
        link.children.forEach(value => {
            if (value.properties.Name.value === "Start")
                start = resolveObjectPointer(parsed.dataModel, value.properties.Value.value).properties.Name.value;
            if (value.properties.Name.value === "End")
                end = resolveObjectPointer(parsed.dataModel, value.properties.Value.value).properties.Name.value;
        });
        linkList[start] ?? (linkList[start] = []);
        linkList[end] ?? (linkList[end] = []);
        linkList[start].push(end);
        linkList[end].push(start);
        bar.increment();
    });
    bar.stop();
    fs_1.default.writeFileSync("./links.json", JSON.stringify(linkList));
})();
