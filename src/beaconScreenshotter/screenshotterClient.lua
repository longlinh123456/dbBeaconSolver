local vu = game:GetService("VirtualUser")
game:GetService("Players").LocalPlayer.Idled:Connect(function()
	vu:Button2Down(Vector2.new(0, 0), workspace.CurrentCamera.CFrame)
	task.wait(1)
	vu:Button2Up(Vector2.new(0, 0), workspace.CurrentCamera.CFrame)
end)
local function urlencode(str)
	str = string.gsub(
		str,
		"([^0-9a-zA-Z !'()*._~-])", -- locale independent
		function(c)
			return string.format("%%%02X", string.byte(c))
		end
	)
	str = string.gsub(str, " ", "+")
	return str
end
local currentSystem = ""
while true do
	currentSystem = urlencode(game:HttpGet("http://127.0.0.1/?systemName=" .. currentSystem, false))
	if currentSystem == "END" then
		break
	end
	getrenv()._G.updateBeacon(currentSystem)
end
