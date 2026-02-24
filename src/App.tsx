import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { JourneyTracker } from './components/JourneyTracker';
import { Leaderboard } from './components/Leaderboard';
import { Badges } from './components/Badges';
import { Home, MapPin, Trophy, Award } from 'lucide-react';

type View = 'dashboard' | 'tracker' | 'leaderboard' | 'badges';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'tracker':
        return <JourneyTracker />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'badges':
        return <Badges />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-blue-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10" role="banner">
        <div className="px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-blue-500 rounded-full flex items-center justify-center" aria-hidden="true">
              <span className="text-white text-sm">🌱</span>
            </div>
            <div>
              <h1 className="text-red-700 text-base">UWE EcoCommute</h1>
              <p className="text-gray-600 text-xs">Sustainable Travel Rewards</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-4" role="main" aria-label="Main content">
        {renderView()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg" role="navigation" aria-label="Main navigation">
        <div className="grid grid-cols-4">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`flex flex-col items-center gap-1 py-2.5 px-2 transition-colors ${
              currentView === 'dashboard'
                ? 'text-red-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
            aria-label="Home Dashboard"
            aria-current={currentView === 'dashboard' ? 'page' : undefined}
          >
            <Home size={22} aria-hidden="true" />
            <span className="text-xs">Home</span>
          </button>
          <button
            onClick={() => setCurrentView('tracker')}
            className={`flex flex-col items-center gap-1 py-2.5 px-2 transition-colors ${
              currentView === 'tracker'
                ? 'text-red-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
            aria-label="Journey Tracker"
            aria-current={currentView === 'tracker' ? 'page' : undefined}
          >
            <MapPin size={22} aria-hidden="true" />
            <span className="text-xs">Track</span>
          </button>
          <button
            onClick={() => setCurrentView('leaderboard')}
            className={`flex flex-col items-center gap-1 py-2.5 px-2 transition-colors ${
              currentView === 'leaderboard'
                ? 'text-red-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
            aria-label="Leaderboard Rankings"
            aria-current={currentView === 'leaderboard' ? 'page' : undefined}
          >
            <Trophy size={22} aria-hidden="true" />
            <span className="text-xs">Rankings</span>
          </button>
          <button
            onClick={() => setCurrentView('badges')}
            className={`flex flex-col items-center gap-1 py-2.5 px-2 transition-colors ${
              currentView === 'badges'
                ? 'text-red-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
            aria-label="Achievement Badges"
            aria-current={currentView === 'badges' ? 'page' : undefined}
          >
            <Award size={22} aria-hidden="true" />
            <span className="text-xs">Badges</span>
          </button>
        </div>
      </nav>
    </div>
  );
}