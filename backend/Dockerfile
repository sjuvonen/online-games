FROM node:15

CMD apt-get update
CMD apt-get install -u unzip

WORKDIR /app/backend

COPY . .

EXPOSE 8000
EXPOSE 8001

CMD bash docker-launch.sh
