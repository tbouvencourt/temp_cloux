# this image relies on the nodejs image
FROM node:20-alpine
# set working directory
WORKDIR /usr/src/log-service
# we need CURL to verify that the key-value storage is running (see boot-in-order.sh)
RUN apk update && apk add curl

# let NPM packages be called anywhere within the container
ENV PATH /usr/src/log-service/node_modules/.bin:${PATH}
ADD package.json .
RUN npm install
# source files of the authentication service
ADD gulpfile.js .
ADD src src
ADD boot-in-order.sh .


# header for loggining messages
ENV DEBUG log-d
# non empty string use perisitence (with CouchDB)
ENV WITH_PERSISTENT_DATA Y

# name of container running CouchDB
ENV DB_HOST log-db
# database name
ENV DB_NAME log
# authentication information to CRUD (create/remove/update/delete) objects in our DB
ENV ADMIN_NAME admin
ENV ADMIN_PASSW admin
ENV DB_URL http://${ADMIN_NAME}:${ADMIN_PASSW}@${DB_HOST}:5984/


ENV USER_SERVICE user-service
ENV USER_SERVICE_URL http://${USER_SERVICE}

# we now use an script to deploy the authentication service
CMD source boot-in-order.sh