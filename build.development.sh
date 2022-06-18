
echo 'Start build backend server'
docker build -t swp/web-app .
docker  rm -f kt2
docker run --name kt2 -p 8081:8081 -d --add-host host.docker.internal:host-gateway  \
    -e PORT=8081 \
    -e DATABASE_NAME=swp \
    -e DATABASE_USER=postgres \
    -e DATABASE_PASSWORD=11 \
    -e DATABASE_PORT=5432 \
    -e DATABASE_HOST=host.docker.internal \
    -e DATABASE_DIALECT=postgres \
    -e NODE_ENV=development \
    -v swp391:/logs \
    swp/web-app 

echo 'Stop build backend server'