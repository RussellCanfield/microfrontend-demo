const { composePlugins, withNx } = require('@nx/webpack');
const { withReact } = require('@nx/react');
const { withModuleFederation } = require('@nx/react/module-federation');
const { FederatedTypesPlugin } = require('@module-federation/typescript');
const CopyPlugin = require('copy-webpack-plugin');

const moduleFederationConfig = require('./module-federation.config');

// Nx plugins for webpack.
module.exports = composePlugins(
  withNx(),
  withReact(),
  withModuleFederation({ ...moduleFederationConfig }),
  (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      path: false,
    };

    config.plugins.push(
      new FederatedTypesPlugin({
        federationConfig: {
          ...moduleFederationConfig,
          filename: 'remoteEntry.js',
          remotes: {
            hero: 'hero@http://localhost:10001',
          },
        },
        typeServeOptions: {
          host: 'localhost',
          port: 10000,
        },
      })
    );

    // config.plugins.forEach((p) => {
    //   if (p.constructor.name === 'ModuleFederationPlugin') {
    //     //Temporary workaround - https://github.com/nrwl/nx/issues/16983
    //     delete p._options.library;
    //   }
    // });

    // config.experiments = { outputModule: false };

    // config.output = {
    //   ...config.output,
    //   scriptType: 'text/javascript',
    // };

    return config;
  }
);
