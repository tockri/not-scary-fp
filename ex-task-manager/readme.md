# Using [Laradock](https://laradock.io)

## First time only
```
$ git clone https://github.com/Laradock/laradock.git
$ cp initial/laradock/.env laradock/
$ cp initial/app/.env app/
$ cd laradock
$ sed -i '' -e "s/ARG MYSQL_VERSION=latest/ARG MYSQL_VERSION=5.7/g" mysql/Dockerfile
$ docker-compose up -d nginx
$ cp initial/laradock/nginx/sites/default.conf laradock/nginx/sites/
$ docker-compose exec workspace bash

root@c492aee1a6cf:/var/www# cd app/
root@c492aee1a6cf:/var/www/app# composer install
root@c492aee1a6cf:/var/www/app# exit

$ docker-compose restart
```

## Run
```
$ cd laradock
$ docker-compose up -d nginx phpmyadmin
```
### Access app
* http://localhost/
### Access phpmyadmin
* http://localhost:8080/
    * server: mysql
    * user: root
    * pass: root

## Stop
```
$ cd laradock
$ docker-composer stop
```

## Restart
```
$ cd laradock
$ docker-compose restart
```

## Clean DB
```
$ rm -rf ~/.laradock/data
```