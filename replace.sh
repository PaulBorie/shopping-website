#!/bin/bash

STRIPE_PUBLIC_KEY=$1
STRIPE_PRIVATE_KEY=$2
FST_DOMAIN=$3
SND_DOMAIN=$4
USERNAME=$5
MAIL=$6

sed -i -e "s/sk/$STRIPE_PUBLIC_KEY/g" -e "s/pk/$STRIPE_PRIVATE_KEY/g" Dockerfile




