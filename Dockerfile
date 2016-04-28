FROM ubuntu:14.04
MAINTAINER madan.venugopal@gmail.com

# Install Node 


RUN \
  	apt-get update \
	&& apt-get install -y --no-install-recommends nodejs \
	&& apt-get install -y --no-install-recommends npm	\
	&& apt-get install -y --no-install-recommends node	\
	&& npm install express


EXPOSE 3000

VOLUME /var/log/revolver_test

ADD node_apps/*.js /

CMD sh -c "nodejs app.js"
