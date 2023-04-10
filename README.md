## Description

[Nestjs](https://github.com/nestjs/nest) framework based jwt authentication.

## Swagger URL

[http://localhost:3000/api](http://localhost:3000/api)

## command to generate SECRET_KEY
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## docker setup for running locally running mongodb
```bash
# pull
docker pull mongo

#run
docker run --name mongo-container -p 27017:27017 -d mongo
```

## command to generate controller 
```bash
npx @nestjs/cli g co controllers/<controller_name>
```

## command to generate service 
```bash
npx @nestjs/cli g s services/<service_name>
```


## Installation

create and .env file at root dir of project, copy all the contents of sample.env and paste into the .env.

```bash
# to install all nessesory dependency
npm install
```

## Running the app

```bash
# development
npm run start
```

```bash
# watch mode
npm run start:dev
```

```bash
# production mode
npm run start:prod
```
