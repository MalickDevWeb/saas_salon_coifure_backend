# SaaS Salon Coiffure Backend

Backend MVP en `Node.js + Express + TypeScript + Prisma + PostgreSQL`.

## Stack

- `Express` pour l'API REST
- `Prisma` pour l'acces base de donnees
- `PostgreSQL` comme stockage principal
- `JWT` pour l'authentification
- `bcryptjs` pour le hash des mots de passe

## Architecture

```text
src/
├── domain/
├── application/
├── infrastructure/
├── interfaces/
└── shared/
```

## Modules MVP

- `auth`: inscription et connexion JWT
- `salons`: liste et recherche de salons proches
- `bookings`: creation et lecture des reservations utilisateur
- `products`: catalogue produits
- `orders`: creation de commandes avec deduction de stock

## Installation

```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

## Variables d'environnement

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/saas_salon"
JWT_SECRET="change-me"
PORT=3000
```

## Endpoints

- `GET /health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/salons`
- `GET /api/salons/nearby?lat=14.7167&lon=-17.4677&radius=5`
- `POST /api/bookings`
- `GET /api/bookings/me`
- `GET /api/products?salonId=<id>`
- `POST /api/orders`
- `GET /api/orders/me`

## Git

Quand tu seras pret a pousser:

```bash
git add .
git commit -m "feat: scaffold backend mvp"
git push -u origin main
```
