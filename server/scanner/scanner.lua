local framework <const> = require "common.frameworks.framework"
local biometricsProvider <const> = require "server.biometrics.biometrics_provider"
local linkedBiometrics <const> = require "server.biometrics.linked_biometrics"

lib.callback.register("evidences:scanFingerprint", function(scanningPlayerId, pedHoldingScanner)
    local fingerprint = biometricsProvider.getFingerprint(scanningPlayerId) -- correct/real fingerprint
    local citizen = linkedBiometrics.getCitizenLinkedToBiometricData("fingerprint", fingerprint) -- citizen linked to the fingerprint (can be a different one)

    TriggerClientEvent("evidences:fingerprintScanned", pedHoldingScanner, citizen)
    return citizen and citizen.success == false or false
end)