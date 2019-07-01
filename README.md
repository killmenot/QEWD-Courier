# QEWD-Courier-QUp

[![Build Status](https://travis-ci.org/QEWD-Courier/QEWD-Courier.svg?branch=develop)](https://travis-ci.org/QEWD-Courier/QEWD-Courier)
[![Coverage Status](https://coveralls.io/repos/github/QEWD-Courier/QEWD-Courier/badge.svg?branch=develop)](https://coveralls.io/github/QEWD-Courier/QEWD-Courier?branch=develop)

## QEWD-Up Version of QEWD Courier

Notes and Installation Instructions

# Purpose

This repository is designed to provide a template for re-designing and re-structuring QEWD-Courier using the QEWD-Up Design Pattern.

As far as possible it uses the original QEWD-Courier REST API handler modules and their dependent sub-modules, with the minimum of changes.  Most of the changes are in terms of the folders and sub-folders in which the handler modules and their dependent sub-modules reside.

Although probably about 90% of the original Helm/QEWD-Courier functionality has been migrated into this modules, there are still a small number of APIs that will need to be ported.  It is intended that the required re-design patterns for these should be clear from the APIs that are included in this repository.


# Contents

You'll see three main folders:

- **main**: The QEWD-Up Version of the original Helm QEWD-Courier Middle Tier
- **oidc_provider**: A standalone version of the OpenId Connect Server used by Helm for user authentication.  This is no longer treated as a QEWD-Courier MicroService, but should be considered as a separate piece of functionality.
- **yottaDB**: Pre-initialised YottaDB files for use by each of the QEWD-Courier MicroServices.  These reside on your host machine and therefore allow persistence of data between restarts of your MicroServices

# Pre-Requisites

- Docker should be installed

- **Important**: Pull a new copy of the very latest Dockerised version of QEWD:

        sudo docker pull rtweed/qewd-server

- If you are using a Digital Ocean Docker Droplet (ie their Droplet instance that has Docker pre-installed), you need to be aware that it is pre-configured with a simple firewall.  You need to open up two ports for use by the external-facing QEWD Courier services:

        sudo ufw allow 8080
        sudo ufw allow 8000

- You'll need to create a custom Docker network:

        sudo docker network create qewd-net

- Clone a copy of the repository into a folder on your host machine.  For the purposes of this document, it will be assumed you've cloned it into *~/qewd-courier* but you can use any folder name you want - adjust the commands with which you start the QEWD-Courier MicroServices appropriately.


- Customise the Global Configuration file: */configuration/global_config.json*

1) Change the host names/IP addresses that are used by the OIDC Client within QEWD-Courier (*auth_service*), ie these lines:


          "oidc_client": {
            "hosts": {
              "oidc_server": "http://192.168.1.78:8000",
              "orchestrator": "http://192.168.1.78:8080"
            },

2) Replace the Discovery Data Service (DDS) test account username and password:

        "DDS": {
          "auth": {
            "host": "https://devauth.discoverydataservice.net",
            "path": "/auth/realms/endeavour/protocol/openid-connect/token",
            "username": "xxxxxxxx",
            "password": "yyyyyyyyyyy",


3) Replace the EtherCIS username/passwords with correct ones.  You might also want to use an EtherCIS server at a different domain name/IP address.

        "openehr": {
          "servers": {
            "ethercis": {
              "url": "http://46.101.81.30:8080",
              "username": "xxxxxx",
              "password": "yyyyyy",


4) You'll also need to amend the OIDC Configuration file: *~/qewd-courier/oidc_provider/settings/configuration.json*.  You'll need to set the *conductor* and *openid_connect* host and ports to match your *main global_config.json* file's *oidc_client* settings for *orchestrator* and *oidc_server* respectively, ie edit this section:

        "phr": {
          "microservices": {
            "conductor": {
              "host": "http://mango-cookie.ripple.foundation",
              "port": 8080
            },
            "openid_connect": {
              "host": "http://mango-cookie.ripple.foundation",
              "port": 8000,

  eg:

            "conductor": {
              "host": "http://192.168.1.78",
              "port": 8080
            },
            "openid_connect": {
              "host": "http://192.168.1.78",
              "port": 8000,


  to match the global_config.json's settings:

          "oidc_client": {
            "hosts": {
              "oidc_server": "http://192.168.1.78:8000",
              "orchestrator": "http://192.168.1.78:8080"



  You'll notice in this file that Two-Factor Authentication is disabled:

        "use2FA": false,

  Which means that the settings for *twilio* and the *email_server* are ignored, so just leave them alone for now.  

  If, later on, you set *use2FA* to *true*, you'll need to set valid credentials for *twilio* and the *email_server*


# Starting the QEWD-Courier MicroServices



## Orchestrator

      sudo docker run -it --name orchestrator --rm --net qewd-net -p 8080:8080 -v ~/qewd-courier/main:/opt/qewd/mapped -v ~/qewd-courier/yottadb/orchestrator:/root/.yottadb/r1.22_x86_64/g rtweed/qewd-server

**Note:** replace *-it* with *-d* to run it as a background daemon process.


## auth_service

        sudo docker run -it --name auth_service --rm --net qewd-net -p 8081:8080 -v ~/qewd-courier/main:/opt/qewd/mapped -e microservice="auth_service" -v ~/qewd-courier/yottaDB/auth_service:/root/.yottadb/r1.22_x86_64/g rtweed/qewd-server

**Note:** replace *-it* with *-d* to run it as a background daemon process.


## openehr_service

        sudo docker run -it --name openehr_service --rm --net qewd-net -p 8082:8080 -v ~/qewd-courier/main:/opt/qewd/mapped -e microservice="openehr_service" -v ~/qewd-courier/yottaDB/openehr_service:/root/.yottadb/r1.22_x86_64/g rtweed/qewd-server

**Note:** replace *-it* with *-d* to run it as a background daemon process.



## discovery_service

        sudo docker run -it --name discovery_service --rm --net qewd-net -p 8083:8080 -v ~/qewd-courier/main:/opt/qewd/mapped -e microservice="discovery_service" -v ~/qewd-courier/yottaDB/discovery_service:/root/.yottadb/r1.22_x86_64/g rtweed/qewd-server

**Note:** replace *-it* with *-d* to run it as a background daemon process.


## OIDC Provider / Server

        sudo docker run -it --rm --name oidc -p 8000:8080 -v ~/qewd-courier/oidc_provider/openid-connect-server:/opt/qewd/mapped -v ~/qewd-courier/oidc_provider/openid-connect-server/www:/opt/qewd/www -v ~/qewd-courier/oidc_provider/settings:/opt/qewd/mapped/settings -v ~/qewd-courier/yottaDB/oidc_provider:/root/.yottadb/r1.22_x86_64/g rtweed/qewd-server

The first time you start the OIDC Provider container, it will configure the OIDC service using data held in the file *~/qewd-courier/oidc_provider/openid-connect-server/documents.json*.  This file is automatically deleted after it loads first time.

You can use the OIDC-Admin application to amend this configuration information.  Login using:

        username: rob.tweed@gmail.com
        password: password


A single Helm / QEWD-Courier user has been pre-defined, again with the credentials:

        username: rob.tweed@gmail.com
        password: password


Note: this version of QEWD-Courier has Two Factor Authentication disabled.  All users you create will automatically have a password of *password*.

## Nb re Roles Based Access Control 

In this release we have set the default user role to 'IDCR' (aka Integrated Digital Care Record access/aka Professional users).
This is an interim solution pending an OIDC upgrade due shortly, which will allow several user roles, PHR/IDCR etc

Please amend the role to 'phrUser' if using this middleware for PHR (Personal Health Record) purposes

Please check /main/auth_service/apis/oidc_callback/index.js where the *session.role* can be amended for now
