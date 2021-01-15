FROM man-cisrv-1.ultra-as.net:4567/docker/node:carbon-alpine

# COPY package.json package-lock.json ./
COPY package.json .
COPY package-lock.json .

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Grab docker config
COPY docker/config/* ./

EXPOSE 80
CMD [ "npm", "start" ]