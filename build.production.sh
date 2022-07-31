
echo 'Start build backend server'
docker build -t swp/web-app .
docker stop kt2

docker run --name kt2 -p 8081:8081 -d --add-host host.docker.internal:host-gateway  \
    -e PORT=8081 \
    -e DATABASE_NAME= ${DATABASE_NAME}\
    -e DATABASE_USER=${DATABASE_USER} \
    -e DATABASE_PASSWORD=${DATABASE_PASSWORD} \
    -e DATABASE_PORT= ${DATABASE_PORT} \
    -e DATABASE_HOST=${DATABASE_HOST} \
    -e DATABASE_DIALECT=${DATABASE_DIALECT} \
    -e NODE_ENV=production \
    --stop-timeout -1 \
    -v pwd:logs \
    swp/web-app 

echo 'Stop build backend server'