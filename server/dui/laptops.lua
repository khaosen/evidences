local database <const> = require "server.database"

MySQL.update.await(
    [[
        CREATE TABLE IF NOT EXISTS evidence_laptops (
            x VARCHAR(50) NOT NULL,
            y VARCHAR(50) NOT NULL,
            z VARCHAR(50) NOT NULL,
            w VARCHAR(50) NOT NULL
        )
    ]]
)

lib.callback.register("evidences:getLaptops", function(source)
    local result <const> = database.query("SELECT * FROM evidence_laptops")
    local laptops = {}

    if result.success then
        for _, coords in pairs(result.response) do
            local converted <const> = {
                x = tonumber(coords.x),
                y = tonumber(coords.y),
                z = tonumber(coords.z),
                w = tonumber(coords.w)
            }
            table.insert(laptops, converted)
        end
    end

    return laptops
end)

lib.callback.register("evidences:placeLaptop", function(source, coords)
    if database.insert(
        [[
            INSERT INTO evidence_laptops (x, y, z, w)
            VALUES (?, ?, ?, ?)
        ]],
        tostring(coords.x), tostring(coords.y), tostring(coords.z), tostring(coords.w)
    ).success then
        TriggerClientEvent("evidences:spawnLaptops", -1, coords)
        return true
    end
end)

lib.callback.register("evidences:pickupLaptop", function(source, coords)
    if database.update(
        [[
            DELETE FROM evidence_laptops
                WHERE x = ?
                AND y = ?
                AND z = ?
                AND w = ?
        ]],
        tostring(coords.x), tostring(coords.y), tostring(coords.z), tostring(coords.w)
    ).success then
        if exports.ox_inventory:AddItem(source, "evidence_laptop", 1) then
            TriggerClientEvent("evidences:destroyLaptop", -1, coords)
            return true
        end
    end
end)