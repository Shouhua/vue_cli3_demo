const chalk = require('chalk');
var AssetsWebpackPlugin = require('assets-webpack-plugin');
var path = require('path');
var fs = require('fs');
var camelCase = require('camelcase');
var webpack = require('webpack');

module.exports = (api, projectOptions) => {
  api.chainWebpack(webpackConfig => {
    // console.log(chalk.yellow('hello, from chain webpack...'));
    // if(webpackConfig.mode === 'production') {
      // console.log('plugins: ', chalk.yellow(JSON.stringify(webpackConfig.plugins)));
      webpackConfig.plugins.delete('html');
      webpackConfig.plugins.delete('preload');
      webpackConfig.plugins.delete('prefetch');
      // webpackConfig.optimization.delete('minimizer');
    // }
  });

  api.configureWebpack(webpackConfig => {

    // console.log('mode: ', chalk.red(webpackConfig.mode));
    // console.log('project options: ', chalk.yellow(JSON.stringify(projectOptions)));
    // console.log(chalk.yellow('helo, from configure webpack'));
    if(webpackConfig.mode === 'production') {
      var src = projectOptions.pluginOptions.src; 
      // entry
      const moduleNames = fs.readdirSync(path.resolve(src, 'modules'));
      if(moduleNames && Array.isArray(moduleNames)) {
        webpackConfig.entry = {};
        moduleNames.forEach((moduleName) => {
          var entry = webpackConfig.entry;
          webpackConfig.entry[`${camelCase(moduleName)}AsyncModule`] = path.resolve(src, `modules/${moduleName}/export.js`);
        });
      }
      // console.log('entry: ', chalk.yellow(JSON.stringify(webpackConfig.entry)));

      // output
      var output = webpackConfig.output;
      output.path = path.resolve(projectOptions.outputDir)
      output.filename = '[name].[hash:6].js';
      output.library = '[name]';
      output.chunkFilename = '[name].[chunkhash:6].js';

      console.log(chalk.yellow(JSON.stringify(webpackConfig.plugins)));

      // plugin
      webpackConfig.plugins.push(
        new AssetsWebpackPlugin({
          path: projectOptions.outputDir
        }),
        new webpack.NamedChunksPlugin(chunk => {
          if(chunk.name) return chunk.name;
          return chunk.mapModules(m => path.relative(m.context, m.request)).join("_");
        })
      );
      // console.log('plugin: ', chalk.yellow(JSON.stringify(webpackConfig.plugins)));
    }
  });

  api.registerCommand('test', {
      description: 'serve---description just for test',
      usage: 'vue-cli-service test [options] [entry]',
      options: {
        '--test': `just for test options`
      }
    },
    async function (args) {
      // const webpackConfig = api.resolveWebpackConfig();
      console.log('plugin options: ', chalk.yellow(JSON.stringify(projectOptions.pluginOptions)));
      // console.log(chalk.yellow(args[0]));
      // console.log(chalk.yellow(args));
    });

  api.registerCommand('dev', {
    description: 'dev',
    usage: 'dev',
    options: {}
  },
    async function(args) {
      const Config = require('webpack-chain');
      const path = require(path);
      const VueLoaderPlugin = require('vue-loader/lib/plugin');

      let config = new Config();
      config
        .mode('development')
        .entry('app')
          .add('src/main.js')
          .end()
        .output
          .path('dist')
          .filename('[name].bundle.js')
          .publicPath('');
      config.resolve
        .alias
          .set('vue', 'vue/dist/vue-runtime-esm.js')
          .set('@', path.resolve(__dirname, 'src'))
          .end()
          .extensions
          .merge(['.js', '.vue', '.json'])
          .end();
      config.module
        .rule('vue')
          .test(/\.vue$/)
          // .exclude(/node_modules/)
          .use('vue-loader')
            .loader('vue-loader')
          
      config.plugin('vue-loader-plugin')
        .use(VueLoaderPlugin);
      console.log(config.toString());

    }
  )
}

// module.exports = () => {}
