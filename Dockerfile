FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install --production

# Bundle app source code
COPY . .

# Expose standard Cloud Run port
EXPOSE 8080

# Environment variables can be mapped directly in Cloud Run
ENV PORT=8080

CMD [ "npm", "start" ]
