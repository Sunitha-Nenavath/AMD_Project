FROM nginx:alpine

# Copy the static web application files to Nginx's serving directory
COPY . /usr/share/nginx/html

# Cloud Run expects the container to listen on Port 8080
EXPOSE 8080

# Update the Nginx default configuration to listen on port 8080 instead of 80
RUN sed -i 's/listen  *80;/listen 8080;/g' /etc/nginx/conf.d/default.conf

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
