local database <const> = require "server.database"

local framework = {}
local ESX <const> = exports.es_extended:getSharedObject()

function framework.getIdentifier(playerId)
    local xPlayer <const> = ESX.GetPlayerFromId(playerId)
    return xPlayer and xPlayer.identifier or nil
end

function framework.getPlayerName(playerId)
    local xPlayer <const> = ESX.GetPlayerFromId(playerId)
    return xPlayer and xPlayer.getName() or "undefined"
end

-- https://github.com/esx-framework/esx_core/blob/b3deeae1ebd6a465310857001e02b34236d97a0e/%5Bcore%5D/es_extended/es_extended.sql#L11
-- https://github.com/esx-framework/esx_core/blob/main/%5Bcore%5D/esx_identity/esx_identity.sql
-- https://github.com/esx-framework/esx_core/blob/main/%5Bcore%5D/esx_identity/server/main.lua
function framework.getCitizens(searchText, limit, offset)
    local pattern <const> = "%" .. searchText:gsub("\\", "\\\\"):gsub("%%", "\\%%"):gsub("_", "\\_") .. "%"

    return database.query(
        [[
            SELECT
                identifier,
                CONCAT_WS(' ', firstname, lastname) AS fullName,
                dateofbirth AS birthdate,
                CASE
                    WHEN LOWER(sex) = 'm' THEN 'male'
                    WHEN LOWER(sex) = 'f' THEN 'female'
                    ELSE 'non_binary'
                END AS gender
            FROM users WHERE disabled = 0
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
                identifier,
                CONCAT_WS(' ', firstname, lastname) AS fullName,
                dateofbirth AS birthdate,
                CASE
                    WHEN LOWER(sex) = 'm' THEN 'male'
                    WHEN LOWER(sex) = 'f' THEN 'female'
                    ELSE 'non_binary'
                END AS gender
            FROM USERS
            WHERE disabled = 0 AND identifier = ?
        ]],
        identifier
    )
end

return framework