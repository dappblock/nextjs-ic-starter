const path = require("path")

let localCanisters, prodCanisters, canisters

function initCanisterIds() {
    try {
        localCanisters = require(path.resolve(
            ".dfx",
            "local",
            "canister_ids.json"
        ))
    } catch (error) {
        console.log("No local canister_ids.json found. Continuing production")
    }
    try {
        prodCanisters = require(path.resolve("canister_ids.json"))
    } catch (error) {
        console.log(
            "No production canister_ids.json found. Continuing with local"
        )
    }

    const network =
        process.env.DFX_NETWORK ||
        (process.env.NODE_ENV === "production" ? "ic" : "local")

    console.info(`network=${network}`)
    console.info(`DFX_NETWORK=${process.env.DFX_NETWORK}`)

    canisters = network === "local" ? localCanisters : prodCanisters

    for (const canister in canisters) {
        process.env[`NEXT_PUBLIC_${canister.toUpperCase()}_CANISTER_ID`] =
            canisters[canister][network]
    }
}
initCanisterIds()

module.exports = {
    initCanisterIds: initCanisterIds,
}
