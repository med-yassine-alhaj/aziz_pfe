# ENGINEERIUM SARL — plateforme de suivi d’études

Application React/Laravel/MySQL pour ENGINEERIUM SARL, bureau d’études en bâtiments et
ouvrages d’art. Elle conserve les portails d’authentification, client, administrateur et
comptable et ajoute les missions d’études, projets, documents versionnés et suivi technique.

## Installation

```powershell
cd C:\Users\medya\ENGINEERIUM\backend
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

Configurer MySQL dans `.env` avant `migrate`. La migration d’adaptation est additive :
elle conserve les tables et les enregistrements existants, et les fichiers techniques sont
stockés sur le disque privé Laravel.

```powershell
cd C:\Users\medya\ENGINEERIUM\frontend
npm install
npm run build
npm run dev
```

## Domaine métier

- Une demande contient le bâtiment/ouvrage, localisation, surface et niveaux facultatifs,
  nature de l’intervention, mission, échéance et documents disponibles.
- Un devis reste personnalisé : aucun tarif officiel n’est affiché.
- L’acceptation d’un devis est transactionnelle et ne peut créer qu’une facture liée.
- Une facture suit la validation comptable ; un paiement est une déclaration, éventuellement
  simulée avec `online_mock`, puis validée ou rejetée par le comptable.
- Un projet est créé après acceptation du devis. Son avancement technique est distinct du
  statut financier et ses transitions sont historisées.
- Les documents de projet acceptent PDF, DWG et IFC dans la limite configurable de 50 Mo,
  conservent les versions et ne sont téléchargés qu’après contrôle d’accès.

## Coordonnées

ENGINEERIUM SARL — Appartement D2, résidence La Tulipe, Centre urbain nord, 1082 Tunis
Téléphone : +216 71 766 100 — Courriel : fradi.hichem@gmail.com

## Vérifications

Depuis `backend`, utiliser `php artisan test` et `vendor/bin/pint --test`.
Depuis `frontend`, utiliser `npm run build`. Les tests réellement exécutés doivent être
reportés dans le bilan de livraison avec leur résultat ; aucune capture n’est considérée
comme disponible tant que l’écran n’a pas été lancé.
