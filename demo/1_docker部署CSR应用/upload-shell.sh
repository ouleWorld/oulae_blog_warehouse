# /dist
# Dockerfile
# docker-compose.yml

# 将本地文件拷贝到服务器
# 需要保证 /tmp/umiTest 这个文件夹的存在, 因此需要提前创建一个 /tmp/umiTes
# TODO: 待优化项: 理论上，创建文件夹这一步可以通过脚本完成
scp -r ./dist root@39.101.122.140:/tmp/umiTest/dist
scp -r ./Dockerfile root@39.101.122.140:/tmp/umiTest
scp -r ./docker-compose.yml root@39.101.122.140:/tmp/umiTest

# 手动的登录服务器执行 docker compose up --build