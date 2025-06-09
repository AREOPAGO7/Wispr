FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libsqlite3-dev \
    sqlite3 \
    zip \
    unzip

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_sqlite mbstring exif pcntl bcmath gd

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy composer files first
COPY composer.json composer.lock ./

# Install composer dependencies
RUN composer install --no-scripts --no-autoloader

# Copy existing application directory including storage
COPY . .

# Set up environment
RUN cp .env.example .env && \
    echo "APP_KEY=base64:tC3hRdJNx/OJoCWYIxFKMFh452+4CVoagSilZRMPk+o=\n\
BROADCAST_DRIVER=pusher\n\
PUSHER_APP_ID=1993149\n\
PUSHER_APP_KEY=e515527fbc6cecef567d\n\
PUSHER_APP_SECRET=6703619e91e142d3a2ac\n\
PUSHER_APP_CLUSTER=eu\n\
PUSHER_HOST=\n\
PUSHER_PORT=443\n\
PUSHER_SCHEME=https\n\
VITE_PUSHER_APP_KEY=\${PUSHER_APP_KEY}\n\
VITE_PUSHER_APP_CLUSTER=\${PUSHER_APP_CLUSTER}\n\
VITE_PUSHER_SCHEME=https\n\
VITE_PUSHER_HOST=\n\
VITE_PUSHER_PORT=443\n\
DB_CONNECTION=sqlite" >> .env

# Install Node.js and build assets
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    # Install main app dependencies and build
    npm ci && \
    # Ensure vite build directory exists
    mkdir -p public/build && \
    # Build with explicit environment variables
    VITE_APP_URL="${APP_URL}" \
    NODE_ENV=production \
    npm run build && \
    # Verify build output
    ls -la public/build && \
    # Install admin app dependencies
    cd admin && \
    npm ci && \
    cd .. && \
    # Generate composer autoloader and run scripts
    composer dump-autoload --optimize && \
    php artisan key:generate --force && \
    php artisan config:cache && \
    php artisan view:cache && \
    chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# Create storage structure and set up symlink
RUN mkdir -p storage/app/public && \
    mkdir -p storage/framework/cache && \
    mkdir -p storage/framework/sessions && \
    mkdir -p storage/framework/views && \
    mkdir -p storage/logs && \
    mkdir -p public/storage && \
    rm -rf public/storage && \
    ln -s ../storage/app/public public/storage

# Set correct permissions
RUN chmod -R 775 storage bootstrap/cache public && \
    chown -R www-data:www-data storage bootstrap/cache public

# Create and setup database
RUN mkdir -p database && \
    touch database/database.sqlite && \
    chmod 775 database/database.sqlite

# Expose port 8000
EXPOSE 8000

# Set recommended PHP.ini settings
RUN echo "memory_limit=512M" > /usr/local/etc/php/conf.d/memory-limit.ini 