# antd ConfigProvider 注意点

本例子使用了自定义 CSS 前缀，因此，在项目初始化的时候需要需要生成 modified.css 文件

```shell
$ lessc --js --modify-var="ant-prefix=custom" node_modules/antd/dist/antd.variable.less ./public/modified.css
```
