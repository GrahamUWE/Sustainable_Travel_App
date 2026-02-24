# 🌱 UWE EcoCommute - Sustainable Travel Rewards App

A mobile-first web application that encourages eco-friendly commuting for UWE students by tracking journeys, calculating emissions saved, and gamifying sustainable travel choices.

## 🚀 Features

### 📊 Dashboard
- View your total points, CO₂ saved, and journey statistics
- Track your daily streak and current rank
- Weekly activity chart
- Recent journey history
- Environmental impact summary

### 🗺️ Journey Tracker
- Log journeys using 10 different transport modes
- Real-time emissions calculator comparing to petrol car baseline
- Instant points calculation preview
- Quick distance presets (0.5km, 1km, 2km, 5km, 10km)

### 🏆 Leaderboard
- See your ranking among UWE students
- Filter by All Time, This Week, or This Month
- Top 3 podium display
- Weekly challenge tracker

### 🎖️ Badges
- Collect 12 different achievement badges
- Track progress on locked badges
- Badge categories: Journeys, Points, CO₂ Saved, Streaks, Transport Mode

## 🚗 Transport Modes

Ranked from most sustainable to least:

| Transport | Icon | Points/km | CO₂ (kg/km) | Category |
|-----------|------|-----------|-------------|----------|
| **Walking** | 🚶 | 15 | 0.000 | Zero Emissions |
| **Cycling** | 🚴 | 20 | 0.000 | Zero Emissions |
| **E-Scooter** | 🛴 | 18 | 0.050 | Low Emissions |
| **Electric Car** | ⚡ | 10 | 0.053 | Low Emissions |
| **Train** | 🚆 | 13 | 0.041 | Low Emissions |
| **Plug-in Hybrid** | 🔌 | 8 | 0.070 | Moderate Emissions |
| **Bus** | 🚌 | 12 | 0.089 | Moderate Emissions |
| **Motorbike** | 🏍️ | 5 | 0.113 | Moderate Emissions |
| **Diesel Car** | 🚗 | 2 | 0.171 | High Emissions |
| **Petrol Car** | 🚙 | 0 | 0.192 | Highest Emissions |

*All emissions calculated against petrol car baseline of 0.192 kg CO₂/km*

## 📱 How to Use

### Getting Started
1. Open the app on your mobile phone for the best experience
2. The app automatically saves all your data locally in your browser
3. Start by clicking the "Track" tab to log your first journey

### Logging a Journey
1. Tap the **Track** tab in the bottom navigation
2. Select your transport mode from the list
3. Enter the distance traveled (or use quick presets)
4. Review your impact preview
5. Tap "Log Journey & Earn Rewards"

### Earning Points & Badges
- **Points**: Automatically earned based on distance × transport mode multiplier
- **Streaks**: Log journeys on consecutive days to build your streak
- **Badges**: Unlock by reaching milestones (journeys, points, CO₂ saved, etc.)
- **Ranking**: Compete with other UWE students on the leaderboard

### Weekly Challenge
Complete 5 sustainable journeys in a week to earn bonus 100 points and a special badge!

## 🎨 Color Scheme

- **Primary**: Red (#dc2626 - #ef4444)
- **Secondary**: Blue (#2563eb - #3b82f6)
- **Success**: Green (for zero-emission modes)
- **Warning**: Orange/Yellow (for moderate emissions)
- **Danger**: Red (for high emissions)

## 💾 Data Storage

All data is stored locally in your browser's localStorage:
- ✅ Your journeys and statistics
- ✅ Points and rank
- ✅ Streak information
- ✅ Badge progress

**Note**: Data is device-specific. Clearing browser data will reset your progress.

## 🛠️ Technical Stack

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts library
- **Icons**: Lucide React
- **Storage**: Browser localStorage API

## 📲 Sharing with Peers

### Option 1: Share the Link
Simply share the URL of this app with your peers. They can open it on any mobile browser.

### Option 2: Run Locally
If you want to run this code locally:

1. Copy all files to your project directory
2. Install dependencies: `npm install react recharts lucide-react`
3. Ensure you have Tailwind CSS v4 configured
4. Run your development server

## ♿ Accessibility Features

- ✅ Keyboard navigation support
- ✅ ARIA labels for screen readers
- ✅ High contrast colors for readability
- ✅ Touch-friendly button sizes (minimum 44×44px)
- ✅ Semantic HTML structure
- ✅ Focus indicators on interactive elements

## 🌍 Environmental Impact

### Emissions Calculation
All calculations use real-world CO₂ emission factors:
- **Baseline**: Average petrol car at 0.192 kg CO₂/km
- **Savings**: Baseline - (Your mode's emissions)

### Example Impact
If you cycle 5km instead of driving:
- **CO₂ Saved**: 0.96 kg (5km × 0.192 kg/km)
- **Points Earned**: 100 points (5km × 20 pts/km)
- **Trees Equivalent**: ~0.05 trees planted

## 📞 Support

For questions or issues with the UWE EcoCommute app, please contact your course coordinator or the UWE sustainability team.

## 🎯 Future Enhancements

Potential features for future versions:
- 🔐 User accounts and cloud sync
- 📍 GPS-based distance tracking
- 👥 Friend comparisons and challenges
- 📅 Monthly and yearly reports
- 🎁 Reward redemption system
- 🗺️ Popular routes mapping

---

**Made for UWE Students** | Encouraging Sustainable Travel Choices 🌱
