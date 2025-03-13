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
local system = ""
getrenv()._G.updateBeacon(system)
game:HttpGet("http://127.0.0.1/?systemName=" .. urlencode(system), false)
