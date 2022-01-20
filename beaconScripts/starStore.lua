local v1 = {}
local u1 = {}
local u2 = {}
local u3 = {}
function v1.refresh()
	u1 = {}
	u2 = {}
	u3 = {}
	for v2, v3 in pairs((game.ReplicatedStorage.System.Sectors:GetChildren())) do
		for v4, v5 in pairs((v3:GetChildren())) do
			u1[v5.Name] = v5
			u2[v5.Identifier.Value] = v5
			u3[string.format("%d:%d", v5.Value.X, v5.Value.Y)] = v5
		end
	end
end
function v1.get(p1)
	return u1[p1]
end
v1.getMatching = require(game.ReplicatedStorage.Source.Common.Util).memoize(function(p2)
	local v6 = {}
	for v7, v8 in pairs(u2) do
		if p2(v8) then
			v6[v7] = v8
		end
	end
	return v6
end)
function v1.getStarFromIdentifier(p3)
	return u2[p3]
end
function v1.getStarFromCoords(p4, p5)
	return u3[string.format("%d:%d", p4, p5)]
end
local u4 = require(script.Searches)
function v1.getAllWithinJumps(p6, p7)
	return u4.getWithin(p6, p7)
end
function v1.getAllExactJumps(p8, p9)
	return u4.getExact(p8, p9)
end
function v1.getAllBetweenJumps(p10, p11, p12)
	return u4.getBetween(p10, p11, p12)
end
function v1.getAll()
	return u1
end
v1.refresh()
return v1
