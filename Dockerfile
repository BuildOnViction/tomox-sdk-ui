# builder environment
FROM node:8.16-alpine as builder
RUN apk update
RUN apk add --no-cache autoconf make gcc g++ git python libgudev-dev linux-headers eudev-dev libusb-compat-dev hwdata-usb
RUN mkdir /app
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
RUN  yarn install --pure-lockfile
COPY . /app

# build environment
FROM node:8.16-alpine as build
COPY --from=builder /app /app
WORKDIR /app
RUN npm install -g sass && yarn build

# production environment
# FROM nginx:1.15.5-alpine
# COPY nginx.conf /etc/nginx
# COPY mime.types /etc/nginx/mime.types
# COPY --from=build /app/build /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
