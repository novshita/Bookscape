# Bookscape

Bookscape is a personal reading companion for discovering books, managing a library, setting reading goals, and tracking reading progress.

## Current Features

- Search books through the Google Books API
- View search results and book details
- Add books to reading shelves:
  - Want to Read
  - Currently Reading
  - Finished
- Persist the library in browser `localStorage`
- Set and persist a yearly reading goal
- Track finished books, remaining books, and goal percentage
- View library completion statistics
- View shelf breakdown and top-rated books
- Record completion dates for books moved to `Finished`
- View monthly completions for books with completion dates
- Responsive dashboard layout

## Tech Stack

- React
- Vite
- JavaScript
- CSS
- Google Books API
- Browser `localStorage`

## Getting Started

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

Vite will display the local development URL in the terminal.

### Create a production build

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## Project Structure

```text
Bookscape/
├── public/
├── src/
│   ├── components/
│   │   ├── AuthPanel.jsx
│   │   ├── BookDetail.jsx
│   │   ├── LibraryShelves.jsx
│   │   ├── ReadingGoal.jsx
│   │   ├── ReadingStatistics.jsx
│   │   ├── SearchBar.jsx
│   │   └── SearchResults.jsx
│   ├── services/
│   │   └── firebase.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Data Storage

The current app stores the library and yearly goal in the browser's local storage:

- `bookscape-library`
- `bookscape-goal`

Without Firebase configuration, the app remains usable without authentication or a backend. When Firebase is configured and a user signs in, the library and yearly goal also sync to Firestore.

## Roadmap

- [x] Set up React + Vite
- [x] Design the initial Bookscape dashboard
- [x] Integrate Google Books API search
- [x] Build book details view
- [x] Add personal library shelves
- [x] Persist library state locally
- [x] Add yearly reading goals
- [x] Add reading statistics
- [x] Split the dashboard into reusable components
- [x] Add editable ratings and reviews
- [x] Add optional Firebase authentication
- [x] Add optional cloud library synchronization
- [ ] Add personalized AI recommendations
- [ ] Add mood-based recommendations
- [ ] Add reading assistant features
- [ ] Add automated tests
- [ ] Deploy the application

## Environment Variables

The Google Books integration works without an API key. Firebase is optional: without Firebase variables, the app stays in local mode and uses browser storage. To enable authentication and Firestore sync, create a local `.env` file with your Firebase web app configuration and never commit real credentials.

Example:

```env
VITE_GOOGLE_BOOKS_API_KEY=your_api_key
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

In Firebase Console, enable Email/Password authentication and create a Firestore database before signing in. User data is stored at `users/{userId}` and includes the library and yearly goal.

## Git Workflow

Changes should be committed in small, logical steps. This project does not require rewriting existing Git history. Before pushing, review the staged files and commit message:

```bash
git status
git add .
git commit -m "Describe the change"
git push origin HEAD
```

## Project Goal

Bookscape aims to combine book discovery, library management, reading goals, progress tracking, statistics, and eventually personalized recommendations in one focused reading experience.
