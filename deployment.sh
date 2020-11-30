#!/bin/bash

#initialize variable

STRIPE_PUBLIC_KEY=$1
STRIPE_PRIVATE_KEY=$2
FST_DOMAIN=$3
SND_DOMAIN="www.$3"
MAIL=$4

dirname="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
result="${dirname%"${dirname##*[!/]}"}" 
WORKDIR="${result##*/}"

dirname="$(dirname "$dirname")"
result="${dirname%"${dirname##*[!/]}"}"
USERNAME="${result##*/}"


#assign the variables to the corresponding variables in the Dockerfile, nginx-conf and docker-compose.yml file

sed -i -e "s/sk/$STRIPE_PRIVATE_KEY/g" -e "s/pk/$STRIPE_PUBLIC_KEY/g" Dockerfile

sed -i -e "s/d1/$FST_DOMAIN/g" -e "s/d2/$SND_DOMAIN/g" nginx-conf/nginx.conf

sed -i -e "s/d1/$FST_DOMAIN/g" -e "s/d2/$SND_DOMAIN/g" -e "s/username/$USERNAME/g"  -e "s/mail_addr/$MAIL/g" -e "s/workdir/$WORKDIR/g" docker-compose.yml

docker-compose up -d

sleep 8

# Modifying the Web Server Configuration and Service Definition

docker-compose stop webserver

mkdir dhparam

sudo openssl dhparam -out /home/"$USERNAME"/"$WORKDIR"/dhparam/dhparam-2048.pem 2048

rm nginx-conf/nginx.conf

#update nginx-conf

sed -i -e "s/d1/$FST_DOMAIN/g" -e "s/d2/$SND_DOMAIN/g" temp/temp-nginx-conf

mv temp/temp-nginx-conf nginx-conf/nginx.conf

#update docker-compose.yml conf

sed -i -e "s/d1/$FST_DOMAIN/g" -e "s/d2/$SND_DOMAIN/g" -e "s/username/$USERNAME/g"  -e "s/mail_addr/$MAIL/g" -e "s/workdir/$WORKDIR/g" temp/temp-docker-compose

rm docker-compose.yml

mv temp/temp-docker-compose docker-compose.yml

#Recreate the webserver service

docker-compose up -d --force-recreate --no-deps webserver

# Renewing Certificates

sed -i -e "s/username/$USERNAME/g" -e "s/workdir/$WORKDIR/g" ssl_renew.sh

line="*/5 * * * * /home/$USERNAME/$WORKDIR/ssl_renew.sh >> /var/log/cron.log 2>&1"
(crontab -u root -l; echo "$line" ) | crontab -u root -













