# Qualisis Server 

## Description

Backend services for qualisis digital web platform. These services are coded in NodeJS using NestJS framework. Follow the above steps to run the application locally and to collaborate in the development

## Pre Requisites

* Node 20+
* Npm 10+

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Code Style
Code style help us to keep the same format and style when we code, we use Linter which is a tool that is able to detec bugs, style errors, etc.

```bash
$ npm run lint
$ npm run format
```

## Start MongoDB
We use Mongo DB as database server, so in order to run it using docker, you have to run this command
```bash
$ docker-compose -f docker-compose.yml up -d
```

## Authentication and Authorization
In order to run locally the project and test it, you need to run ACMA Service which is in charge of authenticate and autorize every user request.
You have to download the repo https://github.com/Artuuro96/dp-acma-server and follow the steps to run it. 

## Commit guidelines
In order to create a new commit we encourage to follow the commit guideline specified in the [pull_request_template.md](./pull_request_template) file.