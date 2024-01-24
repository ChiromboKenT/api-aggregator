# Use an official Node runtime as a parent image
FROM node:20-alpine


WORKDIR /srv/app

COPY client/package*.json ./

RUN npm install

COPY client/ .

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Run npm start when the container launches
CMD ["npm", "run" , "dev"]
