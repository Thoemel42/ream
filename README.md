# Astro + Supabase Starter

Dieses Projekt verbindet ein Astro-Frontend mit einem Supabase-kompatiblen Backend.

## Voraussetzungen

- Docker + Docker Compose
- Optional fuer lokalen Start ohne Docker: Node.js 20+

## 1) Projekt starten (Astro + lokales Backend in Compose)

```bash
docker compose --profile local-supabase up --build
```

Dann ist die App unter `http://localhost:4321` erreichbar.

## 2) Nur Astro starten (mit externem Supabase-Projekt)

Setze in `.env` diese Werte (z. B. aus `.env.example`):

```bash
SUPABASE_DATABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
SUPABASE_ANON_KEY=<anon-key>
SUPABASE_JWT_SECRET=<jwt-secret>
```

Dann nur Astro starten:

```bash
docker compose up --build
```

## 3) Lokal ohne Docker

```bash
npm install
npm run dev
```

Dabei muessen `SUPABASE_DATABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY` und `SUPABASE_JWT_SECRET` in deiner Shell oder `.env` gesetzt sein.

## Hinweise

- Im lokalen Compose-Stack laufen `postgres` + `postgrest`.
- Die Startdaten werden ueber `supabase/init.sql` angelegt.
- Das Datenmodell enthaelt `public.users`, `public.roles`, `public.categories`, `public.resources`.
- Beziehungen:
  - `public.user_roles`: Ein User kann mehrere Rollen haben.
  - `public.role_categories`: Jede Rolle kann mehrere Kategorien enthalten.
  - `public.resources.created_by_email`: Jede Ressource hat einen anlegenden User.
  - `public.resource_roles`: Eine Ressource kann einer oder mehreren Rollen zugeordnet sein.
- Login:
  - `http://localhost:4321/login`
  - Die Startseite `http://localhost:4321` ist geschuetzt und erfordert Login.
  - Nach Login siehst du nur Kategorien, die ueber deine Rollen freigegeben sind.
  - Bei jeder sichtbaren Kategorie werden die zugeordneten Ressourcen angezeigt.
  - Jeder eingeloggte User kann Ressourcen anlegen und sie einer oder mehreren eigenen Rollen zuweisen.
  - Ressourcen bearbeiten/loeschen:
    - Ersteller duerfen ihre eigenen Ressourcen bearbeiten und loeschen.
    - Admins duerfen alle Ressourcen bearbeiten und loeschen.
  - Admin-Funktionen:
    - `http://localhost:4321/admin/roles`
    - Nur User mit Rolle `admin` duerfen Rollen erstellen, bearbeiten und loeschen.
    - Beim Erstellen/Bearbeiten einer Rolle kann der Admin Kategorien zuordnen.
  - Demo-User:
    - `admin` / `admin123`
    - `editor` / `editor123`
    - `reader` / `reader123`
