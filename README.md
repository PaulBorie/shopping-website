# Online selling website model using Node.js, Nginx for the server, Stripe for the payment part and Docker for the deployment

This is a general model for a fictive shopping website.The website also implements the Stripe API to allow the user to intent payment in a secure way on the website. 
To modify the model to your own suit, just go to the items.json file and modify the differents products desccribe in this file to your own selling products. You can also modify the differents title and the overall design of the website with your own hmtl/css and images.  
This repository provides all the necessary scripts for the deployment of such a website on a Virtual Private Server in the cloud.
Thanks to a Docker-compose file and a few commands lines, it deploys three Docker containers : one nginx server serving clients on Port 443 (https) and acting like a reverse proxy, redirecting the client requests to the port 8080 of a contenairized node.js server and finally a Certbot container allowing the user to obtain a SSL certificate with let's encrypt and the daily renewal of this last. 
The Nginx server is the entry point of your webapp, he manages the SSL certificate for https in its conf files and provides a static caching of the static ressources of your website for a lower latency for the clients. 

This model doesn't not implement a database to manage the stock of your products, the products are simply manage in a static way in the items.json file. 

## Requirements

A Virtual Private Server (VPS) running in the cloud or your own server at home
A domain name : you can register some for free at https://www.freenom.com, pointing to the VPS
A merchant account at https://stripe.com and the stripe public api_key and private api_key providing by the account

## Installation/Deployment

-Subscribe for a Virtual Private Server running in Linux in the cloud from any Cloud Services providers. 
-Establish a connection to your VPS via SSH or other preferred manners :

-if there is no user add a user :
```bash
sudo adduser username
```
-go to your home folder (it's important because the script which will be launch lately depends of this location) and clone this repository 

```bash
cd /home/username
git clone <thisrepository> webserver
```
Go to the folder just created and run the install.sh script if Docker and Docker-composed or not already installed on your VPS

```bash
cd webserver
./install.sh
```
Now that Docker and Docker-compose are intalled, you can run the deployment.sh script with 4 arguments : the Stripe public api_key, the Stripe private api_key, the domain name you registered for your website, an email address for the SSL certificate registration.

```bash
./deployment.sh stipe_pub_api_key stripe_private_api_key domainname email
```
Now your website should be availible at yourdomain.com and you sould see the green locker indicating TLS encyption and HTTPS protocol while browsing it.
You can also process payment and you should see all the payments from the client on your Stripe Dashboard.

To see ifthe three Docker containers are running well: 
```
docker-compose ps
```
If you have any problem during the deployment, check the logs
```
docker-compose logs
```


