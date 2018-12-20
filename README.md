# Kafka Manager
I was getting tired of running curl commands from a CLI for Kafka Connect configurations, so I decided to make a quick UI to handle the process for me. I welcome recommendations and pull requests for any added functionality.

![alt text](https://s3.amazonaws.com/beagley-misc/Screenshot+from+2018-12-20+17-06-43.png)

### Current Todos
- Add Information for each Task
- Return Server Status
- Allow Pause/Resume of individual Tasks
- Add Topic administration via Kafka REST api
- Display connector capabilities, and configuration

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Docker build
```
npm run build-docker
```

### Run Docker
```
docker run -it -d -e PORT=9500 -p 9500:9500 kafka_manager:latest node server.js
```