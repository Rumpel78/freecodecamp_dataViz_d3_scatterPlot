FROM node:boron AS node

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./src/package.json /usr/src/app/
#COPY ./src/yarn.lock /usr/src/app/
RUN yarn --pure-lockfile
COPY ./src/ /usr/src/app/
RUN yarn build

FROM nginx
COPY --from=node /usr/src/app/build /usr/share/nginx/html
