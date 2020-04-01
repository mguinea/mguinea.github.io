---
categories:
  - Laravel tutorials
date: 2020-03-31 08:35:08 +0200
header:
  image: /assets/images/posts/laravel-with-docker-without-third-party-packages/laravel-docker.png
  image_description: "Laravel Docker"
  og_image: /assets/images/posts/laravel-with-docker-without-third-party-packages/laravel-docker.png
permalink: /laravel-with-docker-without-third-party-packages
sidebar:
  nav: "laravel-with-docker-without-third-party-packages"
tags:
  - Laravel
  - Docker
  - tutorial
  - easy
title: "Laravel with Docker without third party packages"
---

### Introduction

There are solutions out there that helps you running Laravel with Docker like [laradock](https://laradock.io/) but maybe
you feel overwhelmed by that huge environments and you prefer to implement your own setup avoiding dependencies on third party
implementations.

Well, if that is your case, this is your tutorial. I will be very schematic and concise to avoid the typical TL;DR articles.

We are going to create a Laravel application in a LEMP stack through Docker.

### Requirements

You need to have `Docker` and `Docker Compose` installed in your machine. This article will not get in deep with that, just
check official documentation if any doubt.

[https://docs.docker.com/install/](https://docs.docker.com/install/)

[https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/)

### Create a fresh Laravel project
Just follow Laravel documentation instructions: [https://laravel.com/docs/master#installation](https://laravel.com/docs/master#installation)

### Create Docker Compose file

Docker Compose is the manager of multiple Docker containers.

We need 3 services (each one based on its own Docker container): 
- `app` The responsible of the PHP application.
- `db` The MySQL database. 
- `webserver` In our case, the Nginx server.

Create a new file as below in your `project root` folder:

```bash
nano docker-compose.yml
```

With following content:

{% gist afd280df8d93982582bfff1c66a54edf %}

##### Detailed explanation

TL;DR go to next section [Create Dockerfile](#create-dockerfile)

```yml
version: '3' # This is the version of Docker Compose we will use
```

### Create Dockerfile
As you have noticed, the `app` services has no image like `webserver` or `db` services. 

This is because we will use a local Dockerfile in our project. 
It is useful because the `app` could have special requirements or changes in future and
having it in our source code make any update easy to apply. But it's not mandatory, you can use any existing Docker image
in [https://hub.docker.com/](https://hub.docker.com/)

Create a new file without extension as below in your `project root` folder:

```bash
nano Dockerfile
```

With following content:

{% gist 1c45bb4f127f343f76aa6be9f8e86c25 %}

##### Detailed explanation

TL;DR go to next section [Configure services](#configure-services)

### Configure services
Now that we have all containers and services properly set, we are going to configure each one using `volumes`

#### Configure PHP
Previously we have set a volume in `app` service in `docker-composer.yml` file:

```yaml
volumes:
      - ./docker/php/local.ini:/usr/local/etc/php/conf.d/local.ini
```

This is expecting a `local.ini` file with php settings. If you don't set anything, defaults will rule it. 

Create a new file as below in your `{project root}/docker/php/` folder:

```bash
nano local.ini
```

With following content:

```bash
upload_max_filesize=40M
post_max_size=40M
```
      
#### Configure Nginx
Previously we have set a volume in `webservice` service in `docker-composer.yml` file:

```yaml
volumes:
      - ./docker/nginx/conf.d/:/etc/nginx/conf.d/
```

This is expecting an `app.conf` file with Nginx settings.

Create a new file as below in your `{project root}/docker/nginx/conf.d/` folder:

```bash
nano app.conf
```

With following content:

```
server {
    listen 80;
    index index.php index.html;
    error_log  /var/log/nginx/error.log;
    access_log /var/log/nginx/access.log;
    root /var/www/public;
    location ~ \.php$ {
        try_files $uri =404;
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_pass app:9000;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param PATH_INFO $fastcgi_path_info;
    }
    location / {
        try_files $uri $uri/ /index.php?$query_string;
        gzip_static on;
    }
}

```
#### Configure db
Previously we have set a volume in `db` service in `docker-composer.yml` file:

```yaml
volumes:
      - ./docker/mysql/my.cnf:/etc/mysql/my.cnf
```

This is expecting a `my.cnf` file with MySQL settings.

Create a new file as below in your `{project root}/mysql/` folder:

```bash
nano my.cnf
```

With following content:

```
[mysqld]
general_log = 1
general_log_file = /var/lib/mysql/general.log

```
### Configure .env
Our `db` service has some environment configurations that consumes `.env` file using `${ENV_VARIABLE}`.

We have to setup `.env` file with following information:

```
DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=laravel_app
DB_USERNAME=laravel_app_user
DB_PASSWORD=password
```

### Creating MySQL user
### Containers execution
### Summary
### FAQ
