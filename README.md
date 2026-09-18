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

This keeps the app usable without authentication or a backend. Firebase can be added later when user accounts and cloud synchronization are introduced.

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
- [ ] Add editable ratings and reviews
- [ ] Add Firebase authentication
- [ ] Add cloud library synchronization
- [ ] Add personalized AI recommendations
- [ ] Add mood-based recommendations
- [ ] Add reading assistant features
- [ ] Add automated tests
- [ ] Deploy the application

## Environment Variables

The current Google Books integration works without an API key. If a key is added later, keep it in a local `.env` file and never commit real credentials.

Example:

```env
VITE_GOOGLE_BOOKS_API_KEY=your_api_key
```

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
