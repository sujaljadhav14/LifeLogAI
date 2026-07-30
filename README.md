# LifeLogAI - AI-Powered Personal Life Tracker

A minimalist mobile app that helps you log daily activities, build habits, monitor health, and stay productive with **AI-powered insights powered by Groq LLM**.

Track your mood, energy, sleep, workouts, meals, and goals—then receive personalized daily summaries with actionable suggestions from an intelligent AI coach.

## 🎯 Features

### Core Tracking
- **Daily Check-ins** - Log mood (1-5 scale), energy level (1-10), sleep duration, weight (optional), main focus, and notes
- **Activity Logging** - Track activities throughout the day (workouts, meals, study, work, reading, walking, meditation, custom)
- **Habit Tracker** - Create habits, mark daily completion, view streaks and weekly progress
- **Goal Management** - Set short-term and long-term goals with progress tracking

### Health & Wellness
- **Nutrition Log** - Log meals with calories, protein, and notes
- **Workout Log** - Record exercises with duration, sets/reps, and notes
- **Daily Journal** - Write reflections and view past entries

### AI Intelligence
- **AI Daily Summary** - Groq LLM generates personalized insights including:
  - Productivity overview
  - Encouraging observation about your day
  - 3 practical suggestions for tomorrow

### Design & UX
- Minimalist card-based interface
- Light/dark mode support
- Haptic feedback on interactions
- Fast navigation with zero unnecessary animations
- Local data storage (no cloud required)

## 🛠️ Tech Stack

- **Frontend:** React Native 0.81 | Expo SDK 54 | TypeScript 5.9
- **Styling:** NativeWind 4 (Tailwind CSS for React Native)
- **Backend:** Express.js | tRPC | Node.js
- **Database:** PostgreSQL (optional, for future cloud sync)
- **AI:** Groq LLM (Mixtral 8x7B)
- **Storage:** AsyncStorage (local) | S3 (optional)
- **State Management:** React Context + useReducer
- **Build:** Metro Bundler | Expo Router

## 📋 Prerequisites

- **Node.js** 18+ or higher
- **pnpm** 9.12.0 or higher (or npm/yarn)
- **Expo CLI** (installed via pnpm)
- **Groq API Key** (get one free at [console.groq.com](https://console.groq.com))
- **Android Studio** (for Android development) or **Xcode** (for iOS)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/sujaljadhav14/LifeLogAI.git
cd LifeLogAI
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment Variables

Copy the example environment file and add your credentials:

```bash
cp .env.example .env
```

Edit `.env` and add your Groq API key:

```env
GROQ_API_KEY=your_groq_api_key_here
```

### 4. Run the Development Server

```bash
pnpm dev
```

This will start:
- **Metro Bundler** on `http://localhost:8081` (Expo app preview)
- **Backend API** on `http://localhost:3000` (tRPC endpoints)

### 5. Test the App

#### Option A: Web Preview
Open `http://localhost:8081` in your browser to see the web preview.

#### Option B: Expo Go on Mobile
1. Download **Expo Go** app on your iOS or Android device
2. Scan the QR code displayed in the terminal
3. App loads on your phone

#### Option C: Android Emulator
```bash
pnpm android
```

#### Option D: iOS Simulator (macOS only)
```bash
pnpm ios
```

## 📱 Building for Production

### Generate APK (Android)

```bash
eas build --platform android --local
```

Or use the Manus platform's Publish button for cloud builds.

### Generate IPA (iOS)

```bash
eas build --platform ios --local
```

## 📁 Project Structure

```
LifeLogAI/
├── app/                          # Expo Router app directory
│   ├── (tabs)/                   # Tab-based navigation
│   │   ├── _layout.tsx          # Tab bar configuration
│   │   ├── index.tsx            # Dashboard screen
│   │   ├── checkin.tsx          # Daily Check-in screen
│   │   ├── activities.tsx       # Activity Log screen
│   │   ├── habits.tsx           # Habit Tracker screen
│   │   └── more.tsx             # More menu navigation
│   ├── goals.tsx                # Goals management
│   ├── nutrition.tsx            # Nutrition logging
│   ├── workout.tsx              # Workout logging
│   ├── journal.tsx              # Daily journal
│   ├── summary.tsx              # AI Daily Summary (Groq integration)
│   ├── settings.tsx             # App settings
│   ├── _layout.tsx              # Root layout with providers
│   └── oauth/                   # OAuth callbacks
├── components/                   # Reusable React components
│   ├── screen-container.tsx     # SafeArea wrapper for screens
│   ├── themed-view.tsx          # Theme-aware View component
│   └── ui/                      # UI components
│       └── icon-symbol.tsx      # Icon mapping
├── lib/                         # Utilities and helpers
│   ├── context/
│   │   └── data-context.tsx     # Global data state management
│   ├── services/
│   │   └── data-service.ts      # CRUD operations & storage
│   ├── _core/
│   │   ├── theme.ts             # Theme configuration
│   │   ├── trpc.ts              # tRPC client setup
│   │   └── api.ts               # API utilities
│   └── utils.ts                 # Utility functions
├── types/                       # TypeScript type definitions
│   └── index.ts                 # All data models
├── hooks/                       # Custom React hooks
│   ├── use-colors.ts            # Theme colors hook
│   ├── use-color-scheme.ts      # Dark/light mode detection
│   └── use-auth.ts              # Authentication hook
├── server/                      # Backend server
│   ├── _core/
│   │   ├── index.ts             # Express server setup
│   │   ├── trpc.ts              # tRPC router configuration
│   │   └── llm.ts               # LLM integration
│   ├── routers/
│   │   ├── groq.ts              # Groq LLM router
│   │   └── [other routers]
│   ├── db.ts                    # Database configuration
│   └── storage.ts               # File storage setup
├── constants/                   # App constants
│   ├── theme.ts                 # Theme tokens
│   └── const.ts                 # General constants
├── assets/                      # Images, fonts, icons
│   └── images/
│       ├── icon.png             # App icon
│       ├── splash-icon.png      # Splash screen icon
│       └── favicon.png          # Web favicon
├── theme.config.js              # Tailwind theme configuration
├── tailwind.config.js           # Tailwind CSS config
├── app.config.ts                # Expo app configuration
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Dependencies
├── pnpm-lock.yaml               # Lock file
└── .env                         # Environment variables (create from .env.example)
```

## 🔐 Environment Variables

Create a `.env` file in the project root. See `.env.example` for the template.

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `GROQ_API_KEY` | Groq API key for LLM integration | `gsk_xxxxxxxxxxxxxxxxxxxx` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `EXPO_PUBLIC_API_URL` | Backend API URL | `http://localhost:3000` |

## 🧠 How the AI Summary Works

1. **Data Collection** - App collects your daily data:
   - Activities logged
   - Habits completed/missed
   - Workouts performed
   - Meals consumed
   - Mood, energy, sleep
   - Main focus and notes

2. **API Call** - Frontend sends data to backend `/api/trpc/groq.generateSummary`

3. **Groq Processing** - Backend calls Groq LLM (Mixtral 8x7B model) with your data

4. **AI Generation** - Groq generates:
   - Productivity overview (1-2 sentences)
   - Encouraging observation
   - 3 actionable suggestions for tomorrow

5. **Display** - Summary screen shows formatted results with cards

## 🎨 Customization

### Change App Name
Edit `app.config.ts`:
```typescript
const env = {
  appName: "Your App Name",
  appSlug: "your-app-slug",
  // ...
};
```

### Change Theme Colors
Edit `theme.config.js`:
```javascript
const themeColors = {
  primary: { light: '#0a7ea4', dark: '#0a7ea4' },
  background: { light: '#ffffff', dark: '#151718' },
  // ... more colors
};
```

### Customize AI Prompts
Edit `server/routers/groq.ts` and modify the `prompt` variable in the `generateSummary` procedure.

## 📊 Data Storage

- **Local Storage:** AsyncStorage (on-device, persists between sessions)
- **Future Cloud Sync:** PostgreSQL + Drizzle ORM (optional backend)
- **File Storage:** S3-compatible (for future media uploads)

All data is stored locally by default. No data is sent to external servers except when generating AI summaries via Groq.

## 🐛 Troubleshooting

### Issue: "Groq API key not configured"
**Solution:** Make sure `.env` file exists and contains `GROQ_API_KEY=your_key`

### Issue: "Metro bundler won't start"
**Solution:** 
```bash
pnpm install
rm -rf node_modules/.cache
pnpm dev
```

### Issue: "App crashes on Android"
**Solution:** 
- Clear app cache: Settings → Apps → LifeLogAI → Storage → Clear Cache
- Rebuild: `pnpm android`

### Issue: "Styles not applying"
**Solution:** Restart Metro bundler with `--reset-cache`
```bash
pnpm dev -- --reset-cache
```

## 🔄 Development Workflow

1. **Make changes** to any file in `app/`, `lib/`, `server/`, or `components/`
2. **Metro auto-reloads** - Changes appear instantly in preview
3. **Test on device** - Scan QR code or use emulator
4. **Commit & push** - Push to GitHub when ready

## 📚 API Documentation

### Groq LLM Endpoint

**POST** `/api/trpc/groq.generateSummary`

**Request:**
```json
{
  "json": {
    "activitiesCount": 5,
    "habitsCompleted": 3,
    "habitsMissed": 1,
    "workoutSummary": "2 workouts, 60 minutes total",
    "mealSummary": "3 meals, 2100 calories",
    "goals": 2,
    "mood": 4,
    "energy": 7,
    "sleep": 8,
    "mainFocus": "Project development",
    "notes": "Great day overall"
  }
}
```

**Response:**
```json
{
  "result": {
    "productivityOverview": "You had a productive day with good habit completion.",
    "encouragingObservation": "Your consistency with workouts shows real commitment.",
    "suggestions": [
      "Try to complete all habits tomorrow for a perfect day",
      "Stay hydrated throughout the day",
      "Get 8+ hours of sleep tonight"
    ]
  }
}
```

## 🚢 Deployment

### Option 1: Expo Go (Development)
- Scan QR code with Expo Go app
- Perfect for testing and development

### Option 2: Standalone APK (Android)
```bash
eas build --platform android
# Download APK and install on phone
```

### Option 3: TestFlight (iOS)
```bash
eas build --platform ios
# Use TestFlight link to test on iPhone
```

### Option 4: App Store / Play Store
- Build signed APK/IPA
- Submit to respective app stores
- Follow store guidelines for approval

## 📝 License

This project is open source. Feel free to use, modify, and distribute.

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 💡 Future Enhancements

- [ ] Calendar integration for habit visualization
- [ ] Push notifications for daily reminders
- [ ] Cloud sync with user authentication
- [ ] Food image recognition for meal logging
- [ ] Wearable device integration (Apple Watch, Fitbit)
- [ ] Advanced analytics and weekly/monthly reports
- [ ] Voice input for quick logging
- [ ] AI coaching with follow-up suggestions
- [ ] Social features (share achievements)
- [ ] Export data to PDF/CSV

## 📞 Support

For issues, questions, or suggestions:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Include screenshots and error logs if applicable

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev)
- AI powered by [Groq](https://groq.com)
- Styling with [NativeWind](https://www.nativewind.dev)
- State management with [React Context](https://react.dev/reference/react/useContext)

---

**Happy tracking! 🎯**

Made with ❤️ by the LifeLogAI team
