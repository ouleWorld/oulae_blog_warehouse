// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintWebpackPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CopyPlugin = require('copy-webpack-plugin');

// 表示 hashMode 的模式
const hashMode = 'contenthash';
// nodejs核心模块，直接使用
const os = require('os');
// cpu核数(node 中可以使用下面的代码获取 CPU 信息)
const threads = os.cpus().length;

// true 表示测试环境，false 表示生产环境
const devMode = process.env.NODE_ENV !== 'production';

// 获取处理样式的Loaders
const getStyleLoaders = (preProcessor = '') => {
  const styleList = [
    // 测试环境使用 styles-loader, 生产环境使用 MiniCssExtractPlugin.loader
    devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
    'css-loader',
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: [
            'postcss-preset-env', // 能解决大多数样式兼容性问题
          ],
        },
      },
    },
  ];

  if (preProcessor) {
    styleList.push(preProcessor);
  }

  return styleList;
};

const getPlugin = () => {
  const plugins = [
    new HtmlWebpackPlugin({
      title: 'oulae测试页面',
      // 以 public/index.html 为模板创建文件
      // 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
      template: path.resolve(__dirname, '../public/index.html'),
    }),
    // 提取css成单独文件
    new MiniCssExtractPlugin({
      // 定义输出文件名和目录
      filename: `static/css/[name].[${hashMode}:8].css`,
      chunkFilename: `static/css/[name].[${hashMode}:8].chunk.css`,
    }),
    // eslint
    new ESLintWebpackPlugin({
      // 指定检查文件的根目录
      context: path.resolve(__dirname, '../src'),
      // 指定应该被检查的扩展
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      exclude: 'node_modules', // 默认值
      cache: true, // 开启缓存
      // 缓存目录
      cacheLocation: path.resolve(
        __dirname,
        '../node_modules/.cache/.eslintcache'
      ),
      // eslint 开启多进程的例子
      /**
       * Q: 为什么这里要关闭 eslint-webpack-plugin 的多线程配置呢？
       * A:
       * 这里如果开启了多线程配置的话，eslint 的错误日志是会消失的，暂时没办法处理这个问题，因此将多线的配置关掉了
       */
      // threads
    }),
    // 将public下面的资源复制到dist目录去（除了index.html）
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../public'),
          to: path.resolve(__dirname, '../dist'),
          toType: 'dir',
          noErrorOnMissing: true, // 不生成错误
          globOptions: {
            // 忽略文件
            ignore: ['**/index.html'],
          },
          info: {
            // 跳过terser压缩js
            minimized: true,
          },
        },
      ],
    }),
  ];

  if (!devMode) {
    // 使用 webpack-bundle-analyzer 进行打包产物的分析
    plugins.push(new BundleAnalyzerPlugin());
  }

  return plugins;
};

module.exports = {
  // 单入口
  entry: './src/main.tsx',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: `js/[name].[${hashMode}:8].js`, // 入口文件打包的命名方式
    chunkFilename: `js/[name].[${hashMode}:8].chunk.js`, // 动态导入输出资源命名方式
    clean: true,
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            // 用来匹配 .css 结尾的文件
            test: /\.css$/,
            use: getStyleLoaders(),
          },
          {
            test: /\.less$/,
            use: getStyleLoaders('less-loader'), // use 可以使用多个loader
          },
          {
            test: /\.(jsx|js|ts|tsx)$/,
            exclude: /(node_modules|bower_components)/,
            use: [
              {
                loader: 'thread-loader', // 开启多进程
                options: {
                  workers: threads, // 数量
                },
              },
              {
                loader: 'babel-loader',
                options: {
                  cacheDirectory: true, // 开启babel编译缓存
                  cacheCompression: false, // 缓存文件不要压缩
                  presets: [
                    [
                      '@babel/preset-env',
                      {
                        targets: [
                          'iOS >= 12',
                          'Android >= 4.0',
                          'last 1 version',
                          '> 1%',
                          'not dead',
                        ],
                        useBuiltIns: 'usage', // 表示只引入代码中使用的特性的polyfill
                        corejs: { version: '3', proposals: true },
                      },
                    ],
                    [
                      '@babel/preset-react',
                      // { runtime: 'automatic', importSource: '@emotion/react' },
                    ],
                    '@babel/preset-typescript',
                    [
                      '@emotion/babel-preset-css-prop',
                      {
                        autoLabel: 'dev-only',
                        labelFormat: '[local]',
                      },
                    ],
                  ],
                  // 'transform-runtime' 插件告诉 Babel要引用 runtime 来代替注入。
                  plugins: [
                    // '@emotion/babel-plugin',
                    '@babel/plugin-transform-runtime',
                  ],
                },
              },
            ],
          },
          {
            test: /\.(png|jpe?g|gif)$/i,
            type: 'asset',
            parser: {
              dataUrlCondition: {
                maxSize: 10 * 1024, // 小于10kb的图片会被base64处理
              },
            },
          },
        ],
      },
    ],
  },
  plugins: getPlugin(),
  optimization: {
    minimize: true,
    minimizer: [
      // css压缩
      new CssMinimizerPlugin(),
      // js 压缩
      new TerserPlugin({
        parallel: threads, // 开启多进程
      }),
    ],
    // 代码分割配置
    splitChunks: {
      chunks: 'all', // 对所有模块都进行分割
      // 以下是默认值
      minSize: 20000, // 分割代码最小的大小
      minRemainingSize: 0, // 类似于minSize，最后确保提取的文件大小不能为0
      minChunks: 1, // 至少被引用的次数，满足条件才会代码分割
      maxAsyncRequests: 30, // 按需加载时并行加载的文件的最大数量
      maxInitialRequests: 30, // 入口js文件最大并行请求数量
      enforceSizeThreshold: 50000, // 超过50kb一定会单独打包（此时会忽略minRemainingSize、maxAsyncRequests、maxInitialRequests）
      cacheGroups: {
        // 这个 key 好像仅仅只用于识别作用，没有具体的意义
        // 将react相关的库单独打包，减少node_modules的chunk体积。
        react: {
          name: 'react',
          test: /[\\/]node_modules[\\/]react(.*)?[\\/]/,
          chunks: 'initial',
          priority: 20,
        },
        // 我们将剩余的 node_modules 包都打包进 libs 中
        libs: {
          name: 'chunk-libs',
          test: /[\\/]node_modules[\\/]/,
          priority: 10, // 权重最低，优先考虑前面内容
          chunks: 'initial',
        },
      },
    },
    runtimeChunk: {
      name: (entrypoint) => `runtime~${entrypoint.name}`, // runtime文件命名规则
    },
  },
  devServer: {
    client: {
      // 当出现编译错误或警告时，在浏览器中显示全屏覆盖
      overlay: true,
      // 在浏览器中以百分比显示编译进度。
      progress: true,
      // 告诉 dev-server 它应该尝试重新连接客户端的次数。当为 true 时，它将无限次尝试重新连接
      reconnect: true,
    },
    // 启用 webpack 的 热模块替换 特性：
    hot: true,
    // 无论访问任何一个路径，都会把请求转换为对根路径的请求
    historyApiFallback: true,
    // 告诉 dev-server 在服务器已经启动后打开浏览器。设置其为 true 以打开你的默认浏览器
    open: true,
    // 制定项目的端口号
    port: 4000,
    // 可以允许我们设置代理
    proxy: {
      '/getip': {
        target: 'https://httpbin.org/ip',
        pathRewrite: { '^/getip': '' },
        changeOrigin: true,
        secure: true,
      },
    },
  },
  resolve: {
    // 这个配置可以让我们在引入文件的时候，不需要写文件的后缀
    extensions: ['.js', '.ts', '.jsx', '.tsx'],
  },
  resolveLoader: {
    modules: ['node_modules', path.resolve(__dirname, 'loaders')],
  },
  devtool: devMode ? 'cheap-module-source-map' : 'source-map',
  mode: devMode ? 'development' : 'production',
};
