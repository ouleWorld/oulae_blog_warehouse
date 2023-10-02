// plugins/inline-chunk-webpack-plugin.js
const HtmlWebpackPlugin = require('safe-require')('html-webpack-plugin');

class InlineChunkWebpackPlugin {
  constructor(tests = [/runtime(.*)\.js/]) {
    this.tests = tests;
  }

  apply(compiler) {
    compiler.hooks.compilation.tap(
      'InlineChunkWebpackPlugin',
      (compilation) => {
        const hooks = HtmlWebpackPlugin.getHooks(compilation);

        /**
         * Q: 为什么要在 alterAssetTagGroups 钩子做这件事情呢？
         * A:
         * alterAssetTagGroups 执行的时机是 HtmlWebpackPlugin 将所有的信息给到 templateExecutor 之前，此时所有的 tag 信息已生成，我们可以在这个生命周期中操作
         */
        hooks.alterAssetTagGroups.tap('InlineChunkWebpackPlugin', (assets) => {
          // 修改 tags 产物
          assets.headTags = this.getInlineTag(
            assets.headTags,
            compilation.assets
          );
          assets.bodyTags = this.getInlineTag(
            assets.bodyTags,
            compilation.assets
          );
        });

        // 删除 runtime 文件
        hooks.afterEmit.tap('InlineChunkHtmlPlugin', () => {
          Object.keys(compilation.assets).forEach((assetName) => {
            if (this.tests.some((test) => assetName.match(test))) {
              delete compilation.assets[assetName];
            }
          });
        });
      }
    );
  }

  getInlineTag(tags, assets) {
    return tags.map((tag) => {
      // 非 script 标签不操作
      if (tag.tagName !== 'script') return tag;

      const scriptName = tag.attributes.src;

      // 不是目标的 script 标签不操作
      if (!this.tests.some((test) => scriptName.match(test))) return tag;

      return {
        tagName: 'script',
        // 将 assets 产物直接塞给 innerHTML
        innerHTML: assets[scriptName].source(),
        closeTag: true,
      };
    });
  }
}

module.exports = InlineChunkWebpackPlugin;
