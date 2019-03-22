# In your Dockerfile.
FROM node:8.9.4

# Set default project directory
WORKDIR project

# Set node environment
ENV NPM_CONFIG_LOGLEVEL=warn NODE_ENV=production

# Install dependencies
COPY package.json package-lock.json ./
RUN CI=true npm install

# Copy all local files into the image.
COPY . .

# Build for production.
RUN npm run build

# Set the command to start the node server.
CMD node server
