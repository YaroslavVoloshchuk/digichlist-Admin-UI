FROM node:14.16-alpine as build

RUN mkdir -p /app

WORKDIR /app

COPY package*.json .htaccess ./

RUN npm install

COPY . ./

RUN npm run build

FROM httpd:alpine

COPY --from=build /app/build /usr/local/apache2/htdocs/

COPY ./.htaccess /usr/local/apache2/htdocs/

RUN sed -i '/LoadModule rewrite_module/s/^#//g' /usr/local/apache2/conf/httpd.conf && \
    sed -i 's#AllowOverride [Nn]one#AllowOverride All#' /usr/local/apache2/conf/httpd.conf
    
RUN echo "ServerName localhost" >> /usr/local/apache2/conf/httpd.conf

EXPOSE 80  



