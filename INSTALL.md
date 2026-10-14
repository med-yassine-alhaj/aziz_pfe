# Lancement ENGINEERIUM

## Backend

```powershell
cd C:\Users\medya\ENGINEERIUM\backend
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

## Frontend

```powershell
cd C:\Users\medya\ENGINEERIUM\frontend
npm install
npm run dev
npm run dev:admin
npm run dev:accountant
npm run dev:engineer
```

Le portail public est disponible sur le port Vite configuré. Les portails administrateur et
comptable et ingénieur utilisent leurs commandes dédiées. Le portail ingénieur est accessible
sur `http://127.0.0.1:3003/engineer/login`. Les fichiers techniques sont privés :
ne pas exposer `storage/app` par un serveur statique.

Les données de démonstration doivent rester fictives et être signalées comme telles dans tout
environnement de présentation.
