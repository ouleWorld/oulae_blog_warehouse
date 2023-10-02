const schema = require('./schema.json');

// 异步操作版本
module.exports = function cleanLogLoader(content) {
  const options = this.getOptions(schema);
  const callback = this.async();

  // 异步操作
  setTimeout(function () {
    let result = content;
    if (options.clear) {
      result = content.replace(/console\.log\(.*\);?/g, '');
    }
    callback(null, result);
  }, 10);
};
