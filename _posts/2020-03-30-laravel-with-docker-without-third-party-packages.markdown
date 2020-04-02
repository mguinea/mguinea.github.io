---
categories:
  - Laravel tutorials
date: 2020-04-02 22:23:08 +0200
excerpt: "Use Laravel with Docker in a LEMP environment without any third party package tutorial."
header:
  image: /assets/images/posts/laravel-with-docker-without-third-party-packages/laravel-docker.png
  image_description: "Laravel Docker"
  og_image: /assets/images/posts/laravel-with-docker-without-third-party-packages/og-laravel-docker.png
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

We are going to create a Laravel application in a `LEMP` stack through `Docker` and `Docker Compose`.

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

Create a new file as below in your `{project_root}` folder:

```bash
nano docker-compose.yml
```

With following content:

{% gist afd280df8d93982582bfff1c66a54edf %}

### Create Dockerfile
As you have noticed, the `app` service has no image like `webserver` or `db` services. 

This is because we will use a local Dockerfile in our project. 
It is useful because the `app` could have special requirements or changes in future and
having it in our source code make any update easy to apply. But it's not mandatory, you can use any existing Docker image
in [https://hub.docker.com/](https://hub.docker.com/)

Create a new file without extension as below in your `{project_root}` folder:

```bash
nano Dockerfile
```

With following content:

{% gist 1c45bb4f127f343f76aa6be9f8e86c25 %}

### Configure services
Now that we have all containers and services properly set, we are going to configure each one using `volumes`

#### Configure PHP
Previously we have set a volume in `app` service in `docker-composer.yml` file:

```yaml
volumes:
      - ./docker/php/local.ini:/usr/local/etc/php/conf.d/local.ini
```

This is expecting a `local.ini` file with php settings. If you don't set anything, defaults will rule it. 

Create a new file as below in your `{project_root}/docker/php/` folder:

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
#### Configure MySQL
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

### Containers execution
Once you have all containers defined, you can start them by using:

```bash
docker-compose up -d --remove-orphans
```

If process has finished and it is running, you can query your running containers by using:

```bash
docker ps
```

### Creating MySQL user
Default MySQL installation just creates a `root` user. For security reasons you must create our own db user.

First, you should enter in db container:

```bash
docker-compose exec db bash
```

Once you are in the container, you need to log in as a root admin:

```bash
# mysql -u root -p
```

Password is the same as you set during `docker-compose` file.

Now, lets check what are the available databases:

```bash
mysql> show databases;
```

```
Output
+--------------------+
| Database           |
+--------------------+
| information_schema |
| laravel            |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
5 rows in set (0.00 sec)
```

Now, create new user, grant access to database and flush permissions:

```bash
mysql> GRANT ALL ON laravel.* TO 'laraveluser'@'%' IDENTIFIED BY 'your_laravel_db_password';
mysql> FLUSH PRIVILEGES;
mysql> EXIT;
```

And close container

```bash
# exit
```

Now, there is a new MySQL user account for our project.

It's time to migrate database. Just type:

```bash
docker-compose exec app php artisan migrate
```

### Summary

Docker, Docker compose and a new fresh Laravel project have been installed.

Following files have been created and configured inside the Laravel project:

```
.
├── docker
│   ├── mysql
│   │   └── my.cnf
│   ├── nginx
│   │   └── conf.d
│   │       └── app.conf
│   └── php
│       └── local.ini
├── docker-compose.yml
└── Dockerfile
```

### FAQ

- Q: I have conflicts with container names if I have multiple projects.
- A: This is because each service in `docker-compose.yml` must have an unique `container_name`

- Q: How can I execute artisan commands?
- A: You need to point the container, not directly in your machine. Go to your `{project_root}` and type (for example): `docker-compose exec app php artisan config:cache`

- Q: Can I use terminal directly?
- A: Go to your `{project_root}` and type: `docker-compose exec --u user app bash` with this command you will be in the terminal of `app` container.
