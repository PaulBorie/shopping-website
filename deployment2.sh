#!/bin/bash

#initialize variable

STRIPE_PUBLIC_KEY=$1
STRIPE_PRIVATE_KEY=$2
FST_DOMAIN=$3
SND_DOMAIN=$4
USERNAME=$5
MAIL=$6

#assign the variables to the corresponding variables in the Dockerfile, nginx-conf and docker-compose.yml file

sed -i -e "s/sk/$STRIPE_PUBLIC_KEY/g" -e "s/pk/$STRIPE_PRIVATE_KEY/g" Dockerfile

sed -i -e "s/d1/$FST_DOMAIN/g" -e "s/d2/$SND_DOMAIN/g" nginx-conf/nginx.conf

sed -i -e "s/d1/$FST_DOMAIN/g" -e "s/d2/$SND_DOMAIN/g" -e "s/username/$USERNAME/g"  -e "s/mail_addr/$MAIL/g" docker-compose.yml

docker-compose up -d    
