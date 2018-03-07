# In your Dockerfile.
FROM node:8.9.4

# The base node image sets a very verbose log level.
ENV NPM_CONFIG_LOGLEVEL warn

# Install `serve` to run the application.
RUN npm install -g serve

COPY package.json package.json
RUN CI=true npm install

# Copy all local files into the image.
COPY . .

# Build for production.
RUN npm run build --production

# Set the command to start the node server.
CMD serve -s -p 3001 .
