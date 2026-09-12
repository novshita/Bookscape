# 📚 Bookscape

> **Your personal world of books.**

Bookscape is an AI-powered book tracking and reading companion designed to help readers discover books, manage their personal library, set reading goals, track progress, rate favorites, and receive personalized recommendations.

The project combines **React**, the **Google Books API**, **Firebase**, and AI capabilities to create a personalized reading experience.

---

## ✨ Features

### 📖 Book Discovery
- Search for books using the Google Books API
- View book covers, titles, authors, descriptions, categories, and other available details
- Open a dedicated book details view

### 📚 Personal Library
Organize books into different reading stages:
- Want to Read
- Currently Reading
- Finished

### ⭐ Ratings & Reviews
- Rate completed books
- Add personal reviews
- Keep track of favorite books

### 🎯 Reading Goals
- Set a yearly reading goal
- Track progress toward the goal
- View remaining books needed to reach the target

### 📊 Reading Progress & Statistics
- Books completed throughout the year
- Monthly reading activity
- Average ratings
- Reading progress toward yearly goals
- Reading streaks and other useful statistics

### 🤖 AI-Powered Features
Bookscape will include AI features such as:
- Personalized book recommendations
- Mood-based book recommendations
- AI reading assistance
- Book summaries and explanations
- AI-assisted review writing
- Personalized reading insights

> AI features will be developed progressively as the project evolves.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React.js** | Frontend application and user interface |
| **JavaScript** | Application logic |
| **CSS** | Styling and responsive design |
| **Google Books API** | Book search and book information |
| **Firebase** | Authentication and cloud database |
| **AI API** | Personalized recommendations and AI reading features |
| **Git & GitHub** | Version control and project collaboration |

---

## 🏗️ Planned Architecture

```text
                    ┌─────────────────────┐
                    │      Bookscape      │
                    │     React App       │
                    └──────────┬──────────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
             ▼                 ▼                 ▼
      Google Books API      Firebase          AI Service
             │                 │                 │
             ▼                 ▼                 ▼
       Book Discovery    User Accounts      AI Features
                         & Book Data       & Recommendations
             │                 │                 │
             └─────────────────┼─────────────────┘
                               ▼
                    Personalized Reading
                         Experience
```

---

## 🔄 Application Flow

```text
Search for a Book
        ↓
Google Books API
        ↓
View Book Details
        ↓
Add to Personal Library
        ↓
┌───────────────┬──────────────────┬──────────────┐
│ Want to Read  │ Currently Reading│   Finished   │
└───────────────┴──────────────────┴──────────────┘
                                      ↓
                               Rating & Review
                                      ↓
                              Reading Statistics
                                      ↓
                              AI Personalization
```

---

## 📂 Planned Project Structure

```text
Bookscape/
│
├── public/
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── BookCard.jsx
│   │   ├── SearchBar.jsx
│   │   └── ...
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Search.jsx
│   │   ├── Library.jsx
│   │   ├── Goals.jsx
│   │   ├── Statistics.jsx
│   │   └── ...
│   │
│   ├── services/
│   │   ├── googleBooks.js
│   │   ├── firebase.js
│   │   └── ai.js
│   │
│   ├── firebase/
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .gitignore
├── package.json
├── README.md
└── ...
```

> The structure above is the planned architecture. Files and folders will be added gradually during development.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/novshita/Bookscape.git
```

### 2. Move into the project directory

```bash
cd Bookscape
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

The application will then be available through the local development URL shown in the terminal.

---

## 🔐 Environment Variables

API keys and Firebase configuration should **never be committed directly to GitHub**.

A `.env` file will be used for environment-specific configuration.

Example:

```env
VITE_GOOGLE_BOOKS_API_KEY=your_api_key
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
```

> Never upload `.env` files containing real credentials or API keys to GitHub.

---

## 🗺️ Development Roadmap

- [x] Create project repository
- [ ] Set up React + Vite
- [ ] Design Bookscape UI
- [ ] Integrate Google Books API
- [ ] Build book search
- [ ] Create book details page
- [ ] Set up Firebase
- [ ] Add user authentication
- [ ] Build personal library
- [ ] Add reading status management
- [ ] Add ratings and reviews
- [ ] Implement reading goals
- [ ] Build reading statistics dashboard
- [ ] Add AI book recommendations
- [ ] Add mood-based recommendations
- [ ] Add AI reading assistant
- [ ] Add AI-powered reading insights
- [ ] Improve responsive design
- [ ] Testing and bug fixing
- [ ] Deploy the application

---

## 🎯 Project Goal

The goal of Bookscape is to create a complete, personalized reading platform that combines **book discovery, reading management, progress tracking, and artificial intelligence** in one application.

Instead of simply storing a list of books, Bookscape aims to understand a reader's preferences and reading behavior and use that information to provide a more personalized reading experience.

---

## 🌱 Future Improvements

Possible future additions include:

- 📅 Reading calendar
- 🔥 Advanced reading streaks
- 🏆 Reading achievements and badges
- 👥 Social reading features
- 📌 Custom reading collections
- 📈 Advanced reading analytics
- 🎧 Audiobook tracking
- 📱 Progressive Web App (PWA)
- 🌙 Dark mode
- 🤖 More advanced AI personalization

---

## 👩‍💻 Development Approach

Bookscape is being developed incrementally with a focus on understanding each part of the application rather than relying on automated coding agents.

The project will be built step by step, tested locally, committed to GitHub regularly, and expanded feature by feature.

---

## 📄 License

This project is currently intended for educational and portfolio purposes.
