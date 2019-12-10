
# CDAP-Client-Backend

## Prerequisites
### Environment Variables

Create a **.env** file at the root of the application.

    cd v-tutor-backend
    touch .env

The application requires the following environment variables
```
IAM_USER_KEY=<AWS_ACCESS_KEY_ID>
IAM_USER_SECRET=<AWS_SECRET_ACCESS_KEY>
BUCKET_NAME=<S3_BUCKET_NAME>
AWS_REGION=<S3_BUCKET_REGION>
MONGO_USER=<USER_FOR_MONGODB_CONNECTION_STRING>
MONGO_PASSWORD=<PASSWORD_FOR_MONGODB_CONNECTION_STRING>
```
### Redis
The application uses a redis based queue system called [bull](https://optimalbits.github.io/bull/). Therefore [redis](https://redis.io/download) must be installed on the system and the redis server should be running before starting the application. 

### Nodejs
The application is written in javascript and requires [Nodejs](https://nodejs.org/en/) to run.

### Python
The code-matching, slide-matching and topic segmentation scripts all require python version 2.7.0 or greater and python version 3 to be installed in the environment that the application is being run. 
[https://www.python.org/getit/](https://www.python.org/getit/)

Please ensure that the PATH variable is set so that both these commands can be executed.

    python --version #2.x.x
    python3 --version #3.x.x

## Running the application
Install the required npm packages.

    cd v-tutor-backend
    npm install

The application can be run using the start script

    npm start

For running the application on a server we suggest using [pm2](https://pm2.keymetrics.io/) which will run the application as a daemon process. It also provides log management and monitoring capabilities. 

    npm install -g pm2
    pm2 start npm -- start
 
 
