const dfxJson = require("./dfx.json");
const path = require("path");
const webpack = require("webpack");

// List of all aliases for canisters. This creates the module alias for
// the `import ... from "@dfinity/ic/canisters/xyz"` where xyz is the name of a
// canister.
const dfxAlias = Object.entries(dfxJson.canisters).reduce(
    (acc, [name, _value]) => {
        // Get the network name, or `local` by default.
        const networkName = process.env["DFX_NETWORK"] || "local";
        console.info(`${name}: Using network ${networkName}`);

        const outputRoot = path.join(
            __dirname,
            ".dfx",
            networkName,
            "canisters",
            name
        );

        return {
            ...acc,
            ["dfx-generated/" + name]: path.join(outputRoot, name + ".js"),
        };
    },
    {}
);

const plugin = new webpack.ProvidePlugin({
    Buffer: [require.resolve('buffer/'), 'Buffer'],
    process: require.resolve('process/browser'),
});

const dfxFallback = {
    "assert": require.resolve("assert/"),
    "buffer": require.resolve("buffer/"),
    "events": require.resolve("events/"),
    "stream": require.resolve("stream-browserify/"),
    "util": require.resolve("util/"),
};

module.exports = {
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        // Alias
        const existingAlias = config.resolve.alias;
        const newAlias = Object.assign(dfxAlias, existingAlias);
        config.resolve.alias = newAlias;

        // Plugin
        config.plugins.push(plugin);

        // Fallback
        const existingFallback = config.resolve.fallback;
        const newFallback = Object.assign(dfxFallback, existingFallback);
        config.resolve.fallback = newFallback;
        
        // Important: return the modified config
        return config
    }
}