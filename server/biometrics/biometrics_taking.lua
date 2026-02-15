local framework <const> = require "common.frameworks.framework"
local actions <const> = require "server.evidences.actions"

lib.callback.register("evidences:takeBiometricData", function(playerId, targetId, type, enforce)
    if not enforce then
        TriggerClientEvent("evidences:notify", playerId, { key = "biometrics_taking.notifications.request_sent" }, "inform")

        if not lib.callback.await("evidences:requestConsent", targetId, framework.getPlayerName(playerId), type) then
            TriggerClientEvent("evidences:notify", playerId, { key = "biometrics_taking.notifications.no_consent" }, "error")
            return false
        end

        TriggerClientEvent("evidences:notify", playerId, { key = "biometrics_taking.notifications.consent" }, "success")
    end

    if not actions.collect(playerId, type == "dna" and "saliva" or "fingerprint", targetId) then
        TriggerClientEvent("evidences:notify", playerId, { key = "biometrics_taking.notifications.error" }, "error")
        return false
    end

    return true
end)