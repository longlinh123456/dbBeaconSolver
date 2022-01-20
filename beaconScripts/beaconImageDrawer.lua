local module = {}
local mapGuiOpened = false
local function YNegate(p1)
	return Vector2.new(-p1.Y, p1.X)
end
local spectralClasses = {
	B = Color3.fromRGB(100, 200, 255),
	A = Color3.fromRGB(200, 230, 255),
	F = Color3.fromRGB(255, 245, 210),
	G = Color3.fromRGB(255, 240, 120),
	K = Color3.fromRGB(255, 165, 80),
	M = Color3.fromRGB(255, 80, 60),
	N = Color3.fromRGB(100, 200, 255),
}
local neighborModule = require(game.ReplicatedStorage.Source.Common.Stores.Neighbors)
local starStore = require(game.ReplicatedStorage.Source.Common.Stores.Stars)
local function getDimensionAndCenter(originInfo): (number, Vector2)
	local leftBound = math.huge
	local rightBound = -math.huge
	local lowerBound = math.huge
	local upperBound = -math.huge
	for _, neighbor: string in pairs(neighborModule.get(originInfo.Name)) do
		local neighborInfo: Vector3Value = starStore.get(neighbor)
		leftBound = math.min(leftBound, neighborInfo.Value.X)
		rightBound = math.max(rightBound, neighborInfo.Value.X)
		lowerBound = math.min(lowerBound, neighborInfo.Value.Y)
		upperBound = math.max(upperBound, neighborInfo.Value.Y)
		for _, secondaryNeighbor: string in pairs(neighborModule.get(neighbor)) do
			local secondaryNeighborInfo: Vector3Value = starStore.get(secondaryNeighbor)
			leftBound = math.min(leftBound, secondaryNeighborInfo.Value.X)
			rightBound = math.max(rightBound, secondaryNeighborInfo.Value.X)
			lowerBound = math.min(lowerBound, secondaryNeighborInfo.Value.Y)
			upperBound = math.max(upperBound, secondaryNeighborInfo.Value.Y)
		end
	end
	local horizontalDimension = rightBound - leftBound
	local verticalDimension = upperBound - lowerBound
	local halfDimension = math.max(horizontalDimension, verticalDimension) / 2
	local center = Vector2.new((rightBound + leftBound) / 2, (upperBound + lowerBound) / 2)
	return halfDimension, center
end
local function createSystemDot(systemInfo, YNegatedCenter, scaleRatio): Frame
	local offsetFromCenter = scaleRatio * (YNegate(systemInfo.Value) - YNegatedCenter)
	local systemDotImage = script.Star:Clone()
	systemDotImage.Position = UDim2.new(0.5, offsetFromCenter.X, 0.5, offsetFromCenter.Y)
	systemDotImage.ImageColor3 = spectralClasses[systemInfo.SpectralClass.Value]
	return systemDotImage
end
local function concatenateSystemIdentifiers(p6, p7): string
	if p6.Identifier.Value < p7.Identifier.Value then
		return p6.Identifier.Value .. p7.Identifier.Value
	end
	return p7.Identifier.Value .. p6.Identifier.Value
end
local function drawLink(firstSystemInfo, secondSystemInfo, YNegatedCenter, scaleRatio): Frame
	local firstNegatedPos = YNegate(firstSystemInfo.Value)
	local secondNegatedPos = YNegate(secondSystemInfo.Value)
	local connectingVector = scaleRatio * (secondNegatedPos - firstNegatedPos)
	local linkOffset = scaleRatio * ((firstNegatedPos + secondNegatedPos) / 2 - YNegatedCenter)
	local link = script.Link:Clone()
	link.Position = UDim2.new(0.5, linkOffset.X, 0.5, linkOffset.Y)
	link.Size = UDim2.new(0, connectingVector.Magnitude, 0, 2)
	link.Rotation = math.deg(math.atan2(connectingVector.Y, connectingVector.X))
	return link
end
local function drawMap(imageGui, originSystem)
	local systemsDrawn = {}
	local linksDrawn = {}
	local mapFrame = imageGui.Main.View.Map
	local originInfo = starStore.getStarFromIdentifier(originSystem)
	local halfDimension, center = getDimensionAndCenter(originInfo)
	local scaleRatio = 155 / halfDimension
	local YNegatedCenter = YNegate(center)
	local systemDot = createSystemDot(originInfo, YNegatedCenter, scaleRatio)
	systemDot.Parent = mapFrame
	systemsDrawn[originInfo.Name] = true
	local primaryNeighbors = neighborModule.get(originInfo.Name)
	while true do
		local nextIndex, neighbor = next(primaryNeighbors, nil)
		if not nextIndex then
			break
		end
		local primaryNeighborInfo = starStore.get(neighbor)
		local linkIdentfier = concatenateSystemIdentifiers(originInfo, primaryNeighborInfo)
		if not linksDrawn[linkIdentfier] then
			drawLink(originInfo, primaryNeighborInfo, YNegatedCenter, scaleRatio).Parent = mapFrame
			linksDrawn[linkIdentfier] = true
		end
		systemsDrawn[neighbor] = true
		createSystemDot(primaryNeighborInfo, YNegatedCenter, scaleRatio).Parent = mapFrame
		for _, secondaryNeighbor in pairs(neighborModule.get(neighbor)) do
			if not systemsDrawn[secondaryNeighbor] then
				local secondaryNeighborInfo = starStore.get(secondaryNeighbor)
				local linkIdentifier = concatenateSystemIdentifiers(primaryNeighborInfo, secondaryNeighborInfo)
				if not linksDrawn[linkIdentifier] then
					drawLink(primaryNeighborInfo, secondaryNeighborInfo, YNegatedCenter, scaleRatio).Parent = mapFrame
					linksDrawn[linkIdentifier] = true
				end
				createSystemDot(secondaryNeighborInfo, YNegatedCenter, scaleRatio).Parent = mapFrame
			end
		end
	end
	imageGui.Main.View.Hover.Position = systemDot.Position
end
local function destroyMapGui(mapGui)
	mapGui.Enabled = false
	mapGui:Destroy()
	mapGuiOpened = false
end
function module.createImage(originSystem)
	if not mapGuiOpened then
		mapGuiOpened = true
		local mapGui = script.TreasureMap:Clone()
		drawMap(mapGui, originSystem)
		mapGui.Main.Close.Activated:Connect(function()
			destroyMapGui(mapGui)
		end)
		local targetMarker = mapGui.Main.View.Hover
		local markerAnimateEvent = nil
		markerAnimateEvent = game:GetService("RunService").Heartbeat:Connect(function()
			if not mapGui.Parent then
				markerAnimateEvent:Disconnect()
				return
			end
			targetMarker.Rotation = 20 * tick() % 360
		end)
		mapGui.Parent = game.Players.LocalPlayer.PlayerGui
		mapGui.Enabled = true
	end
end
return module
