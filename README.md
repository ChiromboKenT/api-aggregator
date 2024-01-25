# API AGGREGATOR
## Description

This is a NestJS-based web application that serves as an API aggregator. It leverages various APIs, including NBA and Weather services, to aggregate and deliver real-time updates. Data from different services is seamlessly combined and stored in a database, providing a comprehensive view of NBA game information enriched with weather details.

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)   ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white) ![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white) ![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white) ![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white) ![AmazonDynamoDB](https://img.shields.io/badge/Amazon%20DynamoDB-4053D6?style=for-the-badge&logo=Amazon%20DynamoDB&logoColor=white)

## Prerequisites
- Docker -  ![Docker](http://docker.com)
- Node.js - ![Node.js](http://nodejs.org)

## Installation
### Local - Docker
To spin up the backend containers use the following command from the project root
```bash
docker-compose up
```
Wait for services to start and local resources to be created

Verify the deployment by navigating to your server address in
your preferred browseror use postman.

View frontend client
```
https://localhost:80

```
To use client paste a relative path into the dialog eg:
Fetch Games
```bash
/games?page=1&pageSize=10
```
Fetch Game Article (Augmented game data)
```bash
/games/20/articles/1546293600
```

To Access Backend API - Directly
```bash
https://localhost:6010
```

Example Endpoints
- Get All Games /games
  ```bash
    curl -X GET "http://localhost:6010/api/v1/sse/games?page=1&pageSize=10"
  ```
- Get a Single Game /games/:id/:timestamp
```bash
  curl -X GET "http://localhost:6010/api/v1/sse/games/20
```
- Get Aggregated data - Game Article /games/:id/articles/:timestamp
```bash
  curl -X GET "http://localhost:6010/api/v1/sse/games/20/1546293600
```



To spin up the react front end use the following
```bash
cd client && npm run dev
```

## Stay in touch

- Author - Kenny Chirombo


## License

MIT

**Free Software, Hell Yeah!**
