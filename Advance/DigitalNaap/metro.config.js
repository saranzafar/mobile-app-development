const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const config = {
    resolver: {
        extraNodeModules: {
            stream: require.resolve('stream-browserify'),
            buffer: require.resolve('buffer'),
            events: require.resolve('events'),
            http: require.resolve('stream-http'),
            https: require.resolve('https-browserify'),
            crypto: require.resolve('crypto-browserify'),
            url: require.resolve('url'),
            util: require.resolve('util'),
            assert: require.resolve('assert'),
            // For modules not applicable in React Native, map to an empty module:
            net: require.resolve('./emptyModule.js'),
            tls: require.resolve('./emptyModule.js'),
            zlib: require.resolve('browserify-zlib'),
        },
        sourceExts: [...defaultConfig.resolver.sourceExts, 'cjs'],
    },
};

module.exports = mergeConfig(defaultConfig, config);
