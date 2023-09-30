const path = require('path');
const { generateTheme } = require('antd-theme-generator');

const options = {
  // 这是 node_modules 中 antd 目录的路径
  antDir: path.join(__dirname, './node_modules/antd'),
  // 指向包含 .less 文件的自定义样式目录的路径/路径
  stylesDir: path.join(__dirname, './src'), // all files with .less extension will be processed
  // 主题相关变量文件的路径
  varFile: path.join(__dirname, './src/styles/vars.less'), // default path is Ant Design default.less file
  // List of variables that you want to dynamically change
  themeVariables: [
    '@primary-color',
    '@link-color',
    '@success-color',
    '@warning-color',
    '@error-color',
    // '@font-size-base',
    '@heading-color',
    '@text-color',
    '@text-color-secondary',
    '@disabled-color',
    '@border-radius-base',
    '@border-color-base',
    '@box-shadow-base',
  ],
  // 生成的较少内容将写入指定的文件路径，否则不会写入。不过，你可以使用返回的输出，并写入任何你想要的文件中
  outputFilePath: path.join(__dirname, './public/color.less'), // if provided, file will be created with generated less/styles
  // 该数组用于提供与颜色值相匹配的 regex，大多数情况下您并不需要它
  customColorRegexArray: [/^fade\(.*\)$/], // An array of regex codes to match your custom color variable values so that code can identify that it's a valid color. Make sure your regex does not adds false positives.
};

generateTheme(options)
  .then((less) => {
    console.log('Theme generated successfully');
  })
  .catch((error) => {
    console.log('Error', error);
  });
