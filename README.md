# Deploy a payment-ready Shopping Website in a few command lines thanks to Node.js, Docker and Stripe payment API 

This is a general model for a fictive **shopping website**.The website also implements the **Stripe API** to allow the website to process payments in a secure way.To modify the model to your own suit, just go to the `items.json` file and modify the differents products desccribe in this file to your own selling products. You can also modify the differents title and the overall design of the website with your own hmtl/css and images.  

This repository provides all the necessary scripts for the deployment of such a website on a Virtual Private Server in the Cloud very quicly and easily.
Thanks to a Docker-compose file and a few commands lines, it deploys **three Docker containers** : one **Nginx server** serving clients requests on Port 443 (https) and acting like a reverse proxy, redirecting the client requests to the port 8080 of a contenairized **node.js application** and finally a **Certbot container** allowing the registration of a SSL certificate for your domain name with **let's encrypt** and the daily renewal of this last. 

The Nginx server is the entry point of your webapp, it manages clients requests and their load balancing, provides basic security features for the webserver like the SSL certificate for **HTTPS** in its conf files and provides a static caching of the static ressources of your website for a lower latency for the clients. 

This model does not implement a database to manage the stock of your products, the products are simply managed in a static way in the `items.json` file. 

## Requirements

* A **Linux Virtual Private Server** (VPS) hosted in the Cloud or a server of your own (Cloud services providers usually give credits to new users)
* A **domain name** pointing to the **ip address** of this **VPS** : you can register one for free at https://www.freenom.com
* A **merchant account** at https://stripe.com and the stripe public api_key and private api_key provided by the account

## Test the website locally (only HTTP)

Create a .env file with your Stripe API keys credentials. You will also need Node installed on your computer to launch the server. 

```bash
git clone https://github.com/PaulBorie/shopping-website.git website
cd website
touch .env
PRIVATE_KEY="your_stripe_private_key_here"
PUBLIC_KEY="your_stripe_public_key_here"
echo STRIPE_SECRET_KEY=$PRIVATE_KEY >> .env
echo STRIPE_PUBLIC_KEY=$PUBLIC_KEY >> .env
node server.js 
```
You can see the website live at `http://localhost:8080/` on your webrowser

## Installation/Deployment in the Cloud

Deploy a https **payment-ready** shopping website linked to your **domain name** in a few minutes by following these **commands lines** :

* Establish a connection to your **VPS** via **ssh** or other preferred manners and execute the following commands :

* If there is no user add a **user** :
```bash
sudo adduser username
```
* go to your **home folder (it's important because the script which will be launch lately depends of this location)** and clone this repository 

```bash
cd /home/username
git clone https://github.com/PaulBorie/shopping-website.git webserver
```
* Go to the folder just created and run the `install.sh` script to install **Docker and Docker-Compose** if they are not already installed on your VPS

```bash
cd webserver
./install.sh
```
* Now that Docker and Docker-compose are intalled, you can run the `deployment.sh` script with 4 arguments : the `stripe_public_api_key`, the `stripe_private_ api_key`, the `domain_name` you registered for your website, an `email_address` for the SSL certificate registration.

```bash
./deployment.sh stipe_pub_api_key stripe_private_api_key domainname email
```
Now your website should be **available** at **yourdomain.com** and you sould see the green locker indicating TLS encyption and HTTPS protocol while browsing it.
You can also process payment and you should see all the payments from the clients on your **Stripe Dashboard**. The SSL certificates will be automatically renewed everyday.

To check if the three Docker containers are running well: 
```
docker-compose ps
```
If you encounter any problems during the deployment, check the logs
```
docker-compose logs
```


