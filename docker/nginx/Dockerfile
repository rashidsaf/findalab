FROM nginx:1.11.3

RUN mkdir /etc/nginx/ssl \
    && openssl genrsa -des3 -passout pass:x -out server.pass.key 2048\
    && openssl rsa -passin pass:x -in server.pass.key -out /etc/nginx/ssl/nginx.key\
    && rm server.pass.key\
    && openssl req -new -key /etc/nginx/ssl/nginx.key -out server.csr -subj "/C=US/ST=Texas/L=Houston/O=Medology/OU=Dev/CN=medology.com"\
    && openssl x509 -req -days 365 -in server.csr -signkey /etc/nginx/ssl/nginx.key -out /etc/nginx/ssl/nginx.crt\
    && rm server.csr

COPY nginx.conf /etc/nginx/conf.d/default.conf
