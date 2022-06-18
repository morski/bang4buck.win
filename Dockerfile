FROM nginx:latest

EXPOSE 80

COPY ./src /usr/share/nginx/html