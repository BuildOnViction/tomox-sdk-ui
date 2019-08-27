#build environment
FROM node as builder
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH
COPY package.json /usr/src/app/package.json
COPY public/ /usr/src/app/public/
COPY src/ /usr/src/app/src/

RUN yarn install --silent
RUN yarn global add sass
RUN yarn sass
RUN yarn build


#production environment
FROM nginx:1.14-alpine

COPY --from=builder /usr/src/app/build /usr/share/nginx/html
COPY mime.types etc/nginx/mime.types
COPY nginx.conf etc/nginx/nginx.conf

EXPOSE 443
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
