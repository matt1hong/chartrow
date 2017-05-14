var path = require('path');
var webpack = require('webpack');

var config = {
  context: __dirname
};

config.entry = [
  'babel-polyfill',
  path.join(__dirname, 'static_src', 'js', 'main.js')
];

config.module = {
  loaders: [
    {
      loader:  'babel-loader',
      test:    /\.jsx?$/,
      exclude: /node_modules/,
      query: {
        presets: ["react", "es2015"]
      }
    },
    {
      loader: 'style-loader!css-loader',
      test:    /\.css$/
    }, {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/font-woff',
    }, {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/font-woff2',
    }, {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/octet-stream',
    }, {
        test: /\.otf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/font-otf',
    }, {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file',
    }, {
      test: /\.(png)$/i,
      loaders: [
        'file'
      ]
    }, {
      test: /\.(jpg)$/i,
      loaders: [
        'file'
      ]
    }
  ],
  postLoaders: []
};

config.output = {
  filename: '[name].bundle.js',
  chunkFilename: '[id].chunk.js',
  path: path.join(__dirname, 'static', 'js'),
  publicPath: '/static/js/',
  devtoolModuleFilenameTemplate: '[resourcePath]',
  devtoolFallbackModuleFilenameTemplate: '[resourcePath]?[hash]'
};

config.plugins = [];

config.resolve = {
  extensions: [
    '',
    '.js',
    '.jsx'
  ],
  modulesDirectories: [
    './static_src/js',
    './node_modules/'
  ]
};


module.exports = config;
