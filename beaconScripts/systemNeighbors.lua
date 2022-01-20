local v1 = {}
local v2 = {}
for v3, v4 in pairs((game.ReplicatedStorage.System.Sectors:GetChildren())) do
	for v5, v6 in pairs((v4:GetChildren())) do
		v2[v6.Name] = {}
	end
end
for v7, v8 in pairs((game.ReplicatedStorage.System.Links:GetChildren())) do
	local l__Name__9 = v8.Start.Value.Name
	local l__Name__10 = v8.End.Value.Name
	table.insert(v2[l__Name__9], l__Name__10)
	table.insert(v2[l__Name__10], l__Name__9)
end
function v1.get(p1)
	return v2[p1]
end
function v1.getAll()
	return v2
end
return v1
