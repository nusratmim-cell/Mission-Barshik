FROM node:20-bullseye-slim
ENV WEB_PORT=8779

COPY app /usr/app
WORKDIR /usr/app

EXPOSE $WEB_PORT

CMD npm start -- -p $WEB_PORT
