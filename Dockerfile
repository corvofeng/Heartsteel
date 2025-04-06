#Stage 1
FROM node:22-alpine
WORKDIR /app

# 复制 package.json 和 package-lock.json 到工作目录
COPY ./package.json ./*.lock ./

# ## BOF CLEAN
# # 国内用户可能设置 regietry
ARG registry=https://registry.npmmirror.com/
ARG disturl=https://npmmirror.com/dist
RUN yarn config set disturl $disturl
RUN yarn config set registry $registry
# ## EOF CLEAN

# 安装项目依赖
RUN yarn --only=prod

COPY . .
RUN yarn build

# #Stage 2
# FROM nginx:1.19.0
# WORKDIR /usr/share/nginx/html
# RUN rm -rf ./*
# COPY --from=builder /app/dist .
# ENTRYPOINT ["nginx", "-g", "daemon off;"]
