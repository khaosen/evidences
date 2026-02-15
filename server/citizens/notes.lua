local database <const> = require "server.database"

MySQL.update.await(
    [[
        CREATE TABLE IF NOT EXISTS citizen_notes (
            id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            identifier VARCHAR(500) NOT NULL,
            modifiedAt BIGINT NOT NULL,
            modifiedBy TEXT NOT NULL,
            title TEXT NULL,
            text TEXT NULL
        )
    ]]
)

lib.callback.register("evidences:storeNote", function(source, arguments)
    return database.insert(
        [[
            INSERT INTO citizen_notes (id, identifier, modifiedAt, modifiedBy, title, text)
            VALUES (?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                modifiedAt = ?,
                modifiedBy = ?,
                title = ?,
                text = ?
        ]],
        arguments.id, arguments.identifier, arguments.modifiedAt, arguments.modifiedBy, arguments.title, arguments.text, 
        arguments.modifiedAt, arguments.modifiedBy, arguments.title, arguments.text,
        function(id)
            arguments.id = arguments.id or id
            return arguments
        end)
end)

lib.callback.register("evidences:deleteNote", function(source, arguments)
    return database.update("DELETE FROM citizen_notes WHERE id = ?", arguments.id)
end)

lib.callback.register("evidences:getNotes", function(source, arguments)
    return database.query(
        [[
            SELECT * FROM citizen_notes WHERE identifier = ?
            ORDER BY modifiedAt DESC LIMIT ? OFFSET ?
        ]],
        arguments.identifier, arguments.limit, arguments.offset
    )
end)