FROM alpine:3.10 as build

#MAINTAINER Yaroslav Voloshchuk <bamiks@gmail.com>

RUN mkdir -p /app

WORKDIR /app

RUN apk add --update bash nodejs npm

COPY package*.json .htaccess ./

RUN npm set progress=false && \
    npm config set depth 0 && \
    npm install --only=production

COPY . ./

RUN npm run build

FROM httpd:alpine

COPY --from=build /app/build /usr/local/apache2/htdocs/

COPY ./.htaccess /usr/local/apache2/htdocs/

RUN sed -i '/LoadModule rewrite_module/s/^#//g' /usr/local/apache2/conf/httpd.conf && \
    sed -i 's#AllowOverride [Nn]one#AllowOverride All#' /usr/local/apache2/conf/httpd.conf
    
RUN echo "ServerName localhost" >> /usr/local/apache2/conf/httpd.conf

EXPOSE 80  



