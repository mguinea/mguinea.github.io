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

### Requirements

You need to have `Docker` and `Docker Compose` installed in your machine. This article will not get in deep with that, just
check official documentation if any doubt.

[https://docs.docker.com/install/](https://docs.docker.com/install/)

[https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/)

### Create a fresh Laravel project
Just follow Laravel documentation instructions: [https://laravel.com/docs/master#installation](https://laravel.com/docs/master#installation)

### Create Docker Compose file

Docker Compose is the manager of multiple Docker containers.

We need 3 services: 
- `app` The responsible of the PHP application.
- `webserver` In our case, the Nginx server.
- `db` The MySQL database. 

Create a new file as below in your project root folder:

```bash
nano docker-compose.yml
```

With following content:

{% gist afd280df8d93982582bfff1c66a54edf %}

##### Detailed explanation

```yml
version: '3' # This is the version of Docker Compose we will use
```


### Persistence
### Create Dockerfile
### Configure services
#### Configure PHP
#### Configure Nginx
#### Configure db
### Containers execution
### Creating MySQL user
