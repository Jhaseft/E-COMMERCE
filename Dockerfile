# Usar PHP 8.3 CLI como base
FROM php:8.3-cli

# Instalar dependencias del sistema y extensiones PHP necesarias para Laravel
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    zip \
    curl \
    libzip-dev \
    libonig-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libxml2-dev \
    libpq-dev \
    && docker-php-ext-install pdo pdo_mysql pdo_pgsql pgsql zip mbstring xml gd \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Instalar Node.js 20 LTS y npm
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g npm@latest

# Instalar Composer globalmente
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Establecer directorio de trabajo
WORKDIR /var/www/html

# Copiar solo los archivos necesarios para instalar dependencias primero (cache eficiente)
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

# Copiar el resto del código
COPY . .

# Instalar dependencias JS si usas frontend con Vite/React/Alpine/etc.
RUN if [ -f package.json ]; then npm ci; fi

# Construir frontend si existe
RUN if [ -f package.json ]; then npm run build; fi

# Ajustar permisos de storage y bootstrap/cache
RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Exponer puerto (Laravel normalmente corre en 8000, pero lo hacemos dinámico)
EXPOSE 8080

# Comando para iniciar servidor embebido PHP
CMD ["sh", "-c", "php -S 0.0.0.0:${PORT:-8080} -t public"]
