# F_MCOM — Installation Guide

## Prérequis
- PHP >= 8.2
- Composer
- Node.js >= 18
- MySQL 8.0+

## 1. Backend Laravel

```bash
cd C:\Users\medya\F_MCOM
composer create-project laravel/laravel backend
cd backend

# Installer les dépendances
composer require laravel/sanctum
composer require laravel/socialite
composer require barryvdh/laravel-dompdf
composer require maatwebsite/excel
composer require league/flysystem-local

# Publier les configs
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan vendor:publish --provider="Barryvdh\DomPDF\ServiceProvider"

# Copier les fichiers générés dans backend/ (migrations, models, controllers, etc.)

# Configurer .env (copier .env.example → .env)
php artisan key:generate

# Migrer et seeder
php artisan migrate --seed

# Lancer le serveur
php artisan serve
```

## 2. Frontend React

```bash
cd C:\Users\medya\F_MCOM
npm create vite@latest frontend -- --template react
cd frontend

# Installer les dépendances
npm install
npm install axios react-router-dom
npm install @headlessui/react @heroicons/react
npm install react-hot-toast
npm install react-hook-form
npm install date-fns
npm install recharts

# Installer Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Copier les fichiers src/ générés
npm run dev
```

## 3. Variables d'environnement backend (.env)

```
APP_NAME=F_MCOM
APP_URL=http://localhost:8000

DB_DATABASE=fmcom
DB_USERNAME=root
DB_PASSWORD=

SANCTUM_STATEFUL_DOMAINS=localhost:3000
SESSION_DOMAIN=localhost
FRONTEND_URL=http://localhost:3000

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback
```
