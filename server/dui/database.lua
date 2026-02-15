local config <const> = require "config"
local allowedTypes <const> = { "fingerprint", "dna" }

local database = {}

MySQL.query.await([[CREATE TABLE IF NOT EXISTS stored_fingerprint (
    fingerprint VARCHAR(16) PRIMARY KEY NOT NULL,
    firstname TEXT DEFAULT NULL,
    lastname TEXT DEFAULT NULL,
    birthdate TEXT DEFAULT NULL,
    FOREIGN KEY (fingerprint) REFERENCES biometric_data(fingerprint)
)]])

MySQL.query.await([[CREATE TABLE IF NOT EXISTS stored_dna (
    dna VARCHAR(16) PRIMARY KEY NOT NULL,
    firstname TEXT DEFAULT NULL,
    lastname TEXT DEFAULT NULL,
    birthdate TEXT DEFAULT NULL,
    FOREIGN KEY (dna) REFERENCES biometric_data(dna)
)]])

MySQL.query.await([[CREATE TABLE IF NOT EXISTS wiretaps (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    type ENUM('ObservableCall', 'ObservableRadioFreq', 'ObservableSpyMicrophone') NOT NULL,
    startedAt BIGINT NOT NULL,
    endedAt BIGINT NOT NULL,
    observer TEXT NOT NULL,
    target TEXT NOT NULL,
    protocol TEXT NULL
)]])

local actionStorageDuration <const> = config.wiretap.actionStorageDuration
if actionStorageDuration and type(actionStorageDuration) == "number" and actionStorageDuration > 0 then
    local currentMillis <const> = os.time() * 1000
    MySQL.query.await("DELETE FROM wiretaps WHERE (? - endedAt) > ?", { currentMillis, actionStorageDuration })
end

function database.storePersonalDataForBiometricData(type, biometricData, firstname, lastname, birthdate)
    if not lib.table.contains(allowedTypes, type) then return nil end

    if not firstname and not lastname and not birthdate then
        MySQL.update.await(string.format("DELETE FROM stored_%s WHERE %s = ?", type, type), { biometricData })
        return
    end

    if firstname == "" and lastname == "" and birthdate == "" then
        MySQL.update.await(string.format("DELETE FROM stored_%s WHERE %s = ?", type, type), { biometricData })
        return
    end

    MySQL.insert.await(
        string.format([[
            INSERT INTO stored_%s (%s, firstname, lastname, birthdate)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                firstname = ?,
                lastname = ?,
                birthdate = ?
        ]], type, type),
        { biometricData, firstname, lastname, birthdate, firstname, lastname, birthdate })
end

function database.getPersonalDataByBiometricData(type, biometricData)
    if not lib.table.contains(allowedTypes, type) then return nil end
    return MySQL.prepare.await("SELECT * FROM stored_" .. type .. " WHERE " .. type .. " = ?", { biometricData })
end

function database.storeWiretap(type, startedAt, endedAt, observer, target, protocol)
    MySQL.insert.await("INSERT INTO wiretaps (type, startedAt, endedAt, observer, target, protocol) VALUES (?, ?, ?, ?, ?, ?)",
        { type, startedAt, endedAt, observer, target, protocol })
end

function database.getWiretaps(limit, offset)
    return MySQL.query.await("SELECT * FROM wiretaps ORDER BY endedAt DESC LIMIT ? OFFSET ?", { limit, offset })
end

return database