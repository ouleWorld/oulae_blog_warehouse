# 由于我们部署的是一个 CSR 应用，因此我们只要基于 nginx 镜像即可
FROM nginx:latest

# 指定 Docker 的工作目录
WORKDIR '/app'

# 将项目的打包产物拷贝到工作目录中
COPY /dist .