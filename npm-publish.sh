#!/usr/bin/env bash
echo "\033[0;32m?\033[0m \033[36m请输入你的新发布的版本号(ex:1.0.0)：\033[0m"

read version

sed -i -e "s/\"version\": \(.*\)/\"version\": \"$version\",/g" 'package.json'
if [ -f "package.json-e" ];then
  rm 'package.json-e'
fi
echo '\033[36m版本号修改成功\033[0m'

npm config get registry

npm config set registry=https://registry.npmjs.org

echo '\033[36m请进行登录相关操作：\033[0m'

npm login

echo "-------\033[36mpublishing\033[0m-------"

npm publish

npm config set registry=https://registry.npm.taobao.org

echo "\033[36m 完成 \033[0m"
exit