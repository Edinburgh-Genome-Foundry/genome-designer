FROM ubuntu:14.04
RUN apt-get update
RUN apt-get install curl

#Install latest nodejs
RUN curl --silent --location https://deb.nodesource.com/setup_4.x | sudo bash -
RUN apt-get install -y nodejs

#Install redis
RUN wget http://download.redis.io/redis-stable.tar.gz
RUN tar xvzf redis-stable.tar.gz
RUN cd redis-stable; make; make install

# Bundle app source
COPY . /src
# Install app dependencies
RUN cd /src; npm install

EXPOSE  8080

CMD ["node", "/src/devServer.js"]