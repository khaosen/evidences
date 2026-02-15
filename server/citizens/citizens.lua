local config <const> = require "config"
local framework <const> = require "common.frameworks.framework"
local database <const> = require "server.database"

require "server.citizens.notes"

local citizens = {}

if not config.citizens.synced then
    MySQL.update.await(
        [[
            CREATE TABLE IF NOT EXISTS citizens (
                identifier VARCHAR(500) PRIMARY KEY DEFAULT UUID(),
                fullName TEXT NOT NULL,
                birthdate TEXT NOT NULL,
                gender ENUM('male', 'female', 'non_binary') NOT NULL
            )
        ]]
    )

    lib.callback.register("evidences:storeCitizen", function(source, arguments)
        if arguments.identifier then
            return database.update(
                [[
                    UPDATE citizens SET
                        fullName = ?,
                        birthdate = ?,
                        gender = ?
                    WHERE identifier = ?
                ]],
                arguments.fullName, arguments.birthdate, arguments.gender, arguments.identifier,
                function() return arguments end
            )
        end

        return database.selectFirstColumn(
            [[
                INSERT INTO citizens (fullName, birthdate, gender)
                VALUES (?, ?, ?)
                RETURNING identifier
            ]],
            arguments.fullName, arguments.birthdate, arguments.gender,
            function(identifier)
                arguments.identifier = identifier
                return arguments
            end
        )
    end)

    lib.callback.register("evidences:deleteCitizen", function(source, arguments)
        local identifier <const> = arguments.identifier

        local result = database.update("DELETE FROM linked_fingerprint WHERE identifier = ?", identifier)
        if result.success then
            result = database.update("DELETE FROM linked_dna WHERE identifier = ?", identifier)
            if result.success then
                return database.update("DELETE FROM citizens WHERE identifier = ?", identifier)
            end
        end
        
        return result
    end)
end

lib.callback.register("evidences:getCitizens", function(source, arguments)
    arguments.searchText = arguments.searchText or ""
    arguments.limit = arguments.limit or 1
    arguments.offset = arguments.offset or 0

    if config.citizens.synced then
        return framework.getCitizens(arguments.searchText, arguments.limit, arguments.offset)
    end

    local pattern <const> = "%" .. arguments.searchText:gsub("\\", "\\\\"):gsub("%%", "\\%%"):gsub("_", "\\_") .. "%"

    return database.query(
        [[
            SELECT * FROM citizens
            HAVING fullName LIKE ?
            LIMIT ? OFFSET ?
        ]],
        pattern, arguments.limit, arguments.offset
    )
end)

function citizens.getCitizen(identifier)
    if identifier then
        if config.citizens.synced then
            return framework.getCitizen(identifier)
        end

        return database.selectFirstRow("SELECT * FROM citizens WHERE identifier = ?", identifier)
    end

    return nil
end

lib.callback.register("evidences:getCitizen", function(source, arguments)
    return citizens.getCitizen(arguments.identifier)
end)

return citizens