local database <const> = require "server.database"

local framework = {}

function framework.getIdentifier(playerId)
    local player <const> = exports.ND_Core:getPlayer(playerId)
    return player and player.id or nil
end

function framework.getPlayerName(playerId)
    local player <const> = exports.ND_Core:getPlayer(playerId)
    return player and (player.firstname .. " " .. player.lastname) or "undefined"
end

-- https://github.com/ND-Framework/ND_Core/blob/main/database/characters.sql
function framework.getCitizens(searchText, limit, offset)
    local pattern <const> = "%" .. searchText:gsub("\\", "\\\\"):gsub("%%", "\\%%"):gsub("_", "\\_") .. "%"

    return database.query(
        [[
            SELECT
                charid AS identifier,
                CONCAT_WS(' ', firstname, lastname) AS fullName,
                dob AS birthdate,
                LOWER(gender) AS gender
            FROM nd_characters
            HAVING fullName LIKE ?
            LIMIT ? OFFSET ?
        ]],
        pattern, limit, offset
    )
end

function framework.getCitizen(identifier)
    return database.selectFirstRow(
        [[
            SELECT
                charid AS identifier,
                CONCAT_WS(' ', firstname, lastname) AS fullName,
                dob AS birthdate,
                LOWER(gender) AS gender
            FROM nd_characters
            WHERE charid = ?
        ]],
        identifier
    )
end

return framework