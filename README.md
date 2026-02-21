# ⚔ Solo Leveling Quest Tracker

A gamified task tracker inspired by **Solo Leveling**. Turn your real-life tasks into quests, earn XP, level up, and track your progress on a calendar.

![Solo Leveling Theme](https://img.shields.io/badge/theme-Solo%20Leveling-6366f1?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-6-646cff?style=for-the-badge&logo=vite)

## Features

- 📅 **Calendar View** — Schedule quests on specific dates, see daily progress
- ⚔ **Quest System** — Create tasks with difficulty ranks (E/B/S/Boss), types (daily/weekly/one-time), and stat categories
- 📊 **XP & Leveling** — Earn XP from completed quests, level up with animated effects
- 💪 **Hunter Stats** — STR, INT, AGI, VIT — stats grow based on quest categories
- 🏆 **Achievements** — 10 unlockable titles from "Awakening" to "Shadow Monarch"
- 💀 **Boss Quests** — High-reward quests with special visual effects
- 🔥 **Streak Tracking** — Track consecutive days of quest completion
- 💾 **Persistent Storage** — All progress saved to localStorage

## Quick Start

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/solo-leveling-tracker.git
cd solo-leveling-tracker

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open **http://localhost:5173** in your browser.

## Build for Production

```bash
npm run build
```

Output goes to `dist/` — ready to deploy anywhere.

## Deploy

### Vercel (Recommended — 1 click)
1. Push to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repo → Deploy

### Netlify
1. Push to GitHub
2. Go to [app.netlify.com](https://app.netlify.com)
3. "Add new site" → Import from Git → Deploy

### GitHub Pages
```bash
npm run build
npx gh-pages -d dist
```

## Project Structure

```
solo-leveling-tracker/
├── index.html          # Entry HTML
├── package.json        # Dependencies & scripts
├── vite.config.js      # Vite configuration
├── src/
│   ├── main.jsx        # React mount point
│   ├── App.jsx         # Main app (all UI + logic)
│   └── storage.js      # Storage utility (swap for Firebase etc.)
└── public/             # Static assets
```

## Extending

The app is designed to be easily extended:

- **Firebase/Supabase**: Replace `src/storage.js` with cloud storage calls
- **Boss Fights**: Add interactive combat mechanics to boss quests  
- **Inventory System**: Track rewards and items from completed quests
- **Social Features**: Share achievements or compete with friends
- **Mobile App**: Wrap with Capacitor or React Native

## Tech Stack

- **React 18** — UI framework
- **Vite 6** — Build tool
- **localStorage** — Data persistence (no backend needed)
- **Google Fonts** — Cinzel + Rajdhani typography

## License

MIT
