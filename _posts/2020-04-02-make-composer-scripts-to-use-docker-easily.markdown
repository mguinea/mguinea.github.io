---
categories:
  - Laravel tutorials
date: 2020-04-02 22:57:08 +0200
excerpt: "Use Composer scripts to create shortcuts to use Docker Compose in a faster and easier way"
header:
  image: /assets/images/posts/make-composer-scripts-to-use-docker-easily/docker-composer-scripts.png
  image_description: "Docker Composer Scripts"
  og_image: /assets/images/posts/make-composer-scripts-to-use-docker-easily/og-docker-composer-scripts.png
permalink: /make-composer-scripts-to-use-docker-easily
sidebar:
  nav: "make-composer-scripts-to-use-docker-easily"
tags:
  - Laravel
  - Docker
  - tutorial
  - easy
  - Composer
  - Scripts
title: "Use Composer scripts to create shortcuts to use Docker in a faster and easier way"
---

### Introduction

Docker (and many other solutions) has lots of commands with huge amount of parameters. Usually, we end up just using a few of them
repeteatly and it's good to memorize them but to speed up our dev experience, putting them in an "alias" system will became faster and easier.

### Useful commands

#### `composer docker-up`

The `$ composer docker-up` command starts containers and keep them running:

- `up` start containers
- `-d` keep them running
- `--remove-orphans` remove any unused container

```json
{
  "scripts": {
    "docker-up": [
      "docker-compose up -d --remove-orphans"
    ]
  }
}
```

#### `composer docker-list`

The `$ composer docker-list` lists all running containers:

```json
{
  "scripts": {
    "docker-list": [
      "docker ps"
    ]
  }
}
```

#### `composer docker-upgrade`

The `$ composer docker-upgrade` Pulls an image associated with a service defined in a `docker-compose.yml` and run containers:

```json
{
  "scripts": {
    "docker-upgrade": [
      "docker-compose pull",
      "up -d --remove-orphans"
    ]
  }
}
```

#### `composer docker-destroy`

The `$ composer docker-destroy` Stops containers and removes containers, networks, volumes, and images created by up.

```json
{
  "scripts": {
    "docker-destroy": [
      "docker-compose down"
    ]
  }
}
```

#### `composer docker-restart`

The `$ composer docker-restart` Restarts all stopped and running services.

```json
{
  "scripts": {
    "docker-restart": [
      "docker-compose restart"
    ]
  }
}
```

#### `composer docker-recreate`

The `$ composer docker-recreate` Restarts all stopped and running services.

```json
{
  "scripts": {
    "docker-recreate": [
      "docker-compose up -d --force-recreate"
    ]
  }
}
```

#### All together

You can copy-paste that chunk of code in your `composer.json` script

```json
{
  "scripts": {
    "docker-up": [
      "docker-compose up -d --remove-orphans"
    ],
    "docker-list": [
      "docker ps"
    ],
    "docker-upgrade": [
      "docker-compose pull",
      "up -d --remove-orphans"
    ],
    "docker-destroy": [
      "docker-compose down"
    ],
    "docker-restart": [
      "docker-compose restart"
    ],
    "docker-recreate": [
      "docker-compose up -d --force-recreate"
    ]
  }
}
```

### FAQ

- Q: Can I make a script to enter in a container bash?
- A: A limitation of this approach is that composer cannot enter in a bash. You must type `docker exec -i container-name bash` by yourself.

- Q: Can I parametrize or use variables?
- A: If you want a more complete approach, you will need to think about `Makefile` system.