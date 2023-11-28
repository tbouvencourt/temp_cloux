#!/bin/bash


cd back-end/cart-service/cart/
docker build -t scapp-cart .
cd ../../


cd log-service/log/
docker build -t scapp-log .
cd ../../

cd order-service/order/
docker build -t scapp-order .
cd ../../


cd user-service/users/
docker build -t scapp-user .
cd ../../
cd ../

docker stack rm scapp
docker stack deploy -c scapp.yml scapp
