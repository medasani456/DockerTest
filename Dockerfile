# Use an official Nginx image as a base
FROM nginx:alpine

# Copy web files to Nginx's default public folder
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80