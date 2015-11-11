FROM ubuntu:14.04
RUN apt-get update

#Install latest nodejs
RUN apt-get install -y software-properties-common python-software-properties python g++ make wget
RUN add-apt-repository ppa:chris-lea/node.js
RUN apt-get update
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