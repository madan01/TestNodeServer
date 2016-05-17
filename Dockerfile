FROM ubuntu:14.04.4
MAINTAINER madan.venugopal@gmail.com

# Install Node 


RUN \
  	apt-get update \
	&& apt-get install -y --no-install-recommends nodejs \
	&& apt-get install -y --no-install-recommends npm	\
	&& npm install express	\
#	&& npm install sleep	\ ## unable to install sleep in docker
	&& npm install body-parser \
	&& npm install redis


EXPOSE 3000

ENV REDIS_HOST 192.168.99.100
ENV REDIS_PORT	6379
ENV NODE_SERVER_PORT	3000

VOLUME /var/log/revolver_test

ADD node_apps/*.js /

CMD sh -c "nodejs app.js"
