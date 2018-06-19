FROM node:boron AS node

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./package.json /usr/src/app/
COPY ./yarn.lock /usr/src/app/
RUN yarn --pure-lockfile
RUN yarn build

FROM nginx
COPY --from=node /usr/src/app/build /usr/share/nginx/html
