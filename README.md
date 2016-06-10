# MEAN Book

[![Build Status](https://travis-ci.org/ggcrjdev/meanbook.svg?branch=master)](https://travis-ci.org/ggcrjdev/meanbook)

Sample application based on the concept of social network using the stack MEAN (MongoDB, Express, AngularJS and NodeJS).
To implement the application features, were used the following features provided by this stack:
- Restful API implementation in NodeJS using Node Routing.
- Demonstration of the contexts that can be used in NodeJS: application / session / request.
- Backend integration in AngularJS to the Restful API through a Angular service.

## Installation
### App Prerequisites
- Installation of the NodeJS server.
- Installation of the MongoDB in the path [C:\dev-js\server\mongodb-3.0].
- Is recommanded that your machine has installed the Git client and Python compiler.
- Is recommended to run this app on Windows.

### App Installation
Open command line terminal (cmd) and access the application root folder in the repository cloned from the GitHub and run the following command:
- npm install nodemon grunt bower -g && npm install

## App execution
### Execution in development environment
- Run the [bin/mongodb-start.bat] script (initializes the MongoDB server).
- Run the [bin/node-start.bat] script (initializes the NodeJS server and makes the app available to be accessed).
- Access the app in the browser with the following URL: [http://localhost: 3000].

### Execution in production environment
- Access the app in the browser with the following URL: [https://meanbook.herokuapp.com].
