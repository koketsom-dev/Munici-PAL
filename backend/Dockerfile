# Use official PHP Apache image
FROM php:8.2-apache

# Set working directory
WORKDIR /var/www/html

# Install system dependencies and PostgreSQL PDO driver
RUN apt-get update && apt-get install -y libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql

# Enable Apache rewrite module
RUN a2enmod rewrite

# Copy all backend files into the container
COPY . /var/www/html

# Fix permissions so Apache can serve files
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Allow directory access for development
RUN echo '<Directory /var/www/html/>\n\
    Options Indexes FollowSymLinks\n\
    AllowOverride All\n\
    Require all granted\n\
</Directory>' > /etc/apache2/conf-available/dev-perms.conf && \
    a2enconf dev-perms

# Expose port 80
EXPOSE 80

# Start Apache in the foreground
CMD ["apache2-foreground"]
