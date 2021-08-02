const DFXWebPackConfig = require("./dfx.webpack.config")
DFXWebPackConfig.initCanisterIds()

module.exports = {
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        // Important: return the modified config
        return config
    },
}
