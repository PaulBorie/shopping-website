#!/bin/bash
cd /home/username/workdir/
docker-compose exec  webserver cat /etc/letsencrypt/live/d1/cert.pem > /home/username/workdir/cert/cert.pem
echo "start date : "
date --date="$(openssl x509 -in /home/username/workdir/cert/cert.pem -noout -startdate | cut -d= -f 2)" --iso-8601
echo "end date : "
date --date="$(openssl x509 -in /home/username/workdir/cert/cert.pem -noout -enddate | cut -d= -f 2)" --iso-8601
