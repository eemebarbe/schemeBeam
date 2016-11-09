
var path = require('path');
var webpack = require('webpack');

var BUILD_DIR = path.resolve(__dirname, '../schemeBeam/public/js');
var APP_DIR = path.resolve(__dirname, '../schemeBeam/jsx');

module.exports = {
  entry: {
    index: APP_DIR + '/index.jsx'
  },
  

  output: {
    path: BUILD_DIR,
    filename: '[name].js'
  },

  module : {
    loaders : [
      {
        test : /\.jsx?/,
        include : APP_DIR,
        loader : 'babel',
        exclude: "/node_modules/",
        query:
          {
        presets:['react', 'es2015']
          }
      }
    ]
  },

    externals: {
    'react/addons': 'react/addons'
  },

  plugins: [
        new webpack.optimize.CommonsChunkPlugin("vendors", "vendors.js"),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]

};

