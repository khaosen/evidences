local database <const> = require "server.database"

local framework = {}
local ox = require "@ox_core.lib.init"

function framework.getIdentifier(playerId)
    local oxPlayer <const> = ox.GetPlayer(playerId)
    return oxPlayer and oxPlayer.charId or nil
end

function framework.getPlayerName(playerId)
    local oxPlayer <const> = ox.GetPlayer(playerId)

    if oxPlayer then
        local firstName <const> = oxPlayer.get("firstName")
        local lastName <const> = oxPlayer.get("lastName")

        if firstName and lastName then
            return firstName .. " " .. lastName
        end
    end

    return "undefined"
end

-- https://github.com/CommunityOx/ox_core/blob/main/sql/install.sql
function framework.getCitizens(searchText, limit, offset)
    local pattern <const> = "%" .. searchText:gsub("\\", "\\\\"):gsub("%%", "\\%%"):gsub("_", "\\_") .. "%"

    return database.query(
        [[
            SELECT
                charId AS identifier,
                fullName,
                dateOfBirth AS birthdate,
                gender
            FROM characters
            WHERE deleted IS NULL AND fullName LIKE ?
            LIMIT ? OFFSET ?
        ]],
        pattern, limit, offset
    )
end

function framework.getCitizen(identifier)
    return database.selectFirstRow(
        [[
            SELECT
                charId AS identifier,
                fullName,
                dateOfBirth AS birthdate,
                gender
            FROM characters
            WHERE charId = ?
        ]],
        identifier
    )
end

return framework