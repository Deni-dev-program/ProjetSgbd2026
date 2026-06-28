# ClinicFlow — Application de gestion médicale

Application de bureau développée avec **Electron**, **Angular 19** et **Prisma + SQLite**.

## Fonctionnalités

- **Tableau de bord** — Statistiques générales (agrégations Prisma) : comptage patients, médecins, rendez-vous, médicaments, rendez-vous du jour, répartition par statut.
- **Patients** — CRUD complet avec recherche temps réel.
- **Médecins** — CRUD avec affectation à un département (relation 1:N).
- **Rendez-vous** — CRUD avec filtrage par statut (SCHEDULED / COMPLETED / CANCELLED — Enum Prisma).
- **Départements** — CRUD.
- **Médicaments** — CRUD (formulaire pharmaceutique).
- **Prescriptions** — Table de jonction N:M entre `MedicalRecord` et `Medication`.

## Prérequis

- Node.js ≥ 18
- npm ≥ 9

## Installation et lancement

```bash
# 1. Installer les dépendances root (Electron + Prisma + TypeScript)
npm install

# 2. Installer les dépendances Angular
cd renderer && npm install && cd ..

# 3. Créer le fichier d'environnement (requis pour Prisma)
echo DATABASE_URL="file:./dev.db" > .env

# 4. Générer le client Prisma et créer la base de données SQLite
npx prisma migrate dev --name init

# 5. (Optionnel) Peupler la base de test
npm run prisma:seed

# 6. Lancer l'application (compile Angular + TypeScript, puis ouvre Electron)
npm start
```

> `npm start` compile d'abord Angular (`ng build`), compile le processus principal TypeScript, puis lance Electron en chargeant les fichiers statiques générés.

### Commande tout-en-un

```bash
npm run setup   # installe tout + migre + seed
npm start       # compile et lance l'app
```

## Architecture

```
ProjetSGBD-main/
├── main/
│   ├── main.ts                    ← Processus principal Electron (fenêtre + lifecycle)
│   └── repositories/              ← Handlers IPC séparés par entité
│       ├── department.repository.ts
│       ├── doctor.repository.ts
│       ├── patient.repository.ts
│       ├── appointment.repository.ts
│       ├── medical-record.repository.ts
│       ├── medication.repository.ts
│       ├── prescription.repository.ts
│       └── stats.repository.ts
├── preload/
│   └── preload.ts                 ← contextBridge — expose electronAPI au renderer
├── prisma/
│   ├── schema.prisma              ← Schéma base de données (7 modèles, enum, N:M)
│   └── seed.ts                    ← Données de test
├── renderer/                      ← Application Angular 19 (standalone components)
│   └── src/app/
│       ├── models/                ← Interfaces TypeScript
│       ├── services/              ← Services Angular (signaux, DI, singleton)
│       └── components/            ← Composants standalone (HTML + SCSS + TS séparés)
├── .env                           ← À créer manuellement (DATABASE_URL="file:./dev.db")
└── package.json
```

## Modélisation de la base de données

7 modèles Prisma :

| Modèle | Rôle |
|---|---|
| `Department` | Départements de l'hôpital |
| `Doctor` | Médecins (1:N avec Department) |
| `Patient` | Patients |
| `Appointment` | Rendez-vous (1:N Patient + 1:N Doctor) |
| `MedicalRecord` | Dossiers médicaux (1:N Patient) |
| `Medication` | Médicaments disponibles |
| `Prescription` | **Table de jonction N:M** (MedicalRecord ↔ Medication) |

### Relations clés

- `Department` 1:N `Doctor` (`onDelete: Restrict`)
- `Patient` 1:N `Appointment` (`onDelete: Cascade`)
- `Doctor` 1:N `Appointment` (`onDelete: Restrict`)
- `Patient` 1:N `MedicalRecord` (`onDelete: Cascade`)
- `MedicalRecord` N:M `Medication` via `Prescription` (`@@id([medicalRecordId, medicationId])`)

### Enum Prisma

```prisma
enum AppointmentStatus {
  SCHEDULED
  COMPLETED
  CANCELLED
}
```

## Concepts Angular démontrés

| Notion | Où |
|---|---|
| Composants standalone | Tous les composants (`standalone: true`) |
| Séparation HTML / SCSS / TS | Tous les composants (générés avec `ng generate component`) |
| Interfaces TypeScript | `app/models/index.ts` |
| `signal()` | Tous les services et composants |
| `computed()` | `filteredPatients`, `doctorCount`, `scheduledCount`… |
| `@for` / `@if` | Tous les templates de liste |
| Services + DI | 6 services (`providedIn: 'root'`) |
| `input.required<T>()` | `StatCardComponent`, `PatientCardComponent` |
| `output<T>()` | `PatientCardComponent` (edit, delete) |
| Formulaires réactifs | `PatientFormComponent`, `DoctorFormComponent`, etc. |
| Routage (HashLocationStrategy) | 6 routes + `<router-outlet>` |
| `RouterLink` | Sidebar navigation |
| `effect()` *(bonus)* | `AppointmentListComponent` |

## Architecture IPC (Electron ↔ Angular)

Les handlers IPC sont répartis dans des fichiers repository séparés (`main/repositories/`), chacun enregistrant ses propres canaux `ipcMain.handle`. Le fichier `main/main.ts` les importe et les appelle avec l'instance `PrismaClient`.

Le `preload/preload.ts` expose l'objet `window.electronAPI` via `contextBridge`, permettant au renderer Angular d'appeler les handlers IPC sans accès direct à Node.js.

## Scripts npm disponibles

| Script | Description |
|---|---|
| `npm start` | Compile Angular + TypeScript, puis lance Electron |
| `npm run build` | Compile Angular + TypeScript (sans lancer Electron) |
| `npm run build:renderer` | Compile uniquement Angular (`ng build`) |
| `npm run build:main` | Compile uniquement le processus principal TypeScript |
| `npm run prisma:migrate` | Crée/applique les migrations |
| `npm run prisma:seed` | Peuple la base avec des données de test |
| `npm run prisma:studio` | Ouvre Prisma Studio (UI base de données) |
