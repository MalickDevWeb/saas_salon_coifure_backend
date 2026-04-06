# Backend Git Workflow

## Branches permanentes

- `main`: production stable uniquement
- `develop`: integration des fonctionnalites valides avant release

## Branches temporaires

- `feature/backend-auth`
- `feature/backend-salons`
- `feature/backend-geolocation`
- `feature/backend-bookings`
- `feature/backend-products`
- `feature/backend-orders`
- `feature/backend-payments`
- `feature/backend-notifications`
- `feature/backend-admin`
- `feature/backend-tests`
- `hotfix/backend-<short-description>`
- `release/backend-vX.Y.Z`

## Regles

- Ne jamais developper directement sur `main`
- Eviter de developper directement sur `develop`
- Chaque fonctionnalite part de `develop`
- Chaque correction urgente part de `main`
- Chaque merge vers `main` doit venir d'une release ou d'un hotfix

## Flux normal

```bash
git switch develop
git pull origin develop
git switch -c feature/backend-auth
```

Travail, puis:

```bash
git add .
git commit -m "feat: add backend auth module"
git push -u origin feature/backend-auth
```

Ensuite:

- Pull request `feature/backend-auth` -> `develop`
- Tests et revue
- Merge dans `develop`

## Release

Quand `develop` est valide:

```bash
git switch develop
git pull origin develop
git switch -c release/backend-v1.0.0
git push -u origin release/backend-v1.0.0
```

Ensuite:

- Pull request `release/backend-v1.0.0` -> `main`
- Tag apres merge sur `main`
- Merge de retour vers `develop` si besoin

## Hotfix

```bash
git switch main
git pull origin main
git switch -c hotfix/backend-jwt-expiration
```

Puis:

- Pull request `hotfix/backend-jwt-expiration` -> `main`
- Reporter aussi le correctif vers `develop`

## Convention de commits

- `feat: ...`
- `fix: ...`
- `refactor: ...`
- `test: ...`
- `docs: ...`
- `chore: ...`
