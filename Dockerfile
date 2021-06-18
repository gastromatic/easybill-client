ARG NODE_VERSION

###

FROM node:${NODE_VERSION}-alpine

USER node
WORKDIR /home/node

COPY /src/ ./src/
COPY /test/ ./test/

COPY ./package.json ./package-lock.json ./tsconfig.build.json ./tsconfig.json ./
RUN npm ci 

