FROM nginx:alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the static files to the nginx html directory
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# The default command for nginx will start the server
