import { useState, useEffect } from 'react';
import { Trophy, TrendingUp, Medal, Crown } from 'lucide-react';
import { getUserData, getLeaderboardData } from '../utils/storage';

type LeaderboardEntry = {
  rank: number;
  name: string;
  points: number;
  journeys: number;
  emissionsSaved: number;
  isCurrentUser?: boolean;
};

export function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [filter, setFilter] = useState<'all' | 'week' | 'month'>('all');
  const userData = getUserData();

  useEffect(() => {
    const data = getLeaderboardData(filter);
    setLeaderboard(data);
  }, [filter]);

  useEffect(() => {
    const refreshData = () => {
      const data = getLeaderboardData(filter);
      setLeaderboard(data);
    };
    
    window.addEventListener('journey-logged', refreshData);
    return () => window.removeEventListener('journey-logged', refreshData);
  }, [filter]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="text-yellow-500" size={24} />;
      case 2:
        return <Medal className="text-gray-400" size={24} />;
      case 3:
        return <Medal className="text-orange-600" size={24} />;
      default:
        return <span className="text-gray-600">#{rank}</span>;
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 3:
        return 'bg-gradient-to-r from-orange-400 to-orange-600';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-blue-600 rounded-xl p-4 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Trophy size={28} />
          <div>
            <h2 className="text-white text-lg">Leaderboard</h2>
            <p className="opacity-90 text-xs">See how you rank among UWE students</p>
          </div>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
          <div className="flex justify-between items-center text-xs">
            <div>
              <p className="text-white/80">Your Rank</p>
              <p className="text-white text-sm">#{userData.rank}</p>
            </div>
            <div>
              <p className="text-white/80">Your Points</p>
              <p className="text-white text-sm">{userData.points}</p>
            </div>
            <div>
              <p className="text-white/80">Total Saved</p>
              <p className="text-white text-sm">{userData.totalEmissionsSaved.toFixed(1)} kg</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg p-1.5 shadow-sm flex gap-1.5">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-2 px-3 rounded-md transition-all text-xs ${
            filter === 'all'
              ? 'bg-red-500 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          All Time
        </button>
        <button
          onClick={() => setFilter('week')}
          className={`flex-1 py-2 px-3 rounded-md transition-all text-xs ${
            filter === 'week'
              ? 'bg-red-500 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          This Week
        </button>
        <button
          onClick={() => setFilter('month')}
          className={`flex-1 py-2 px-3 rounded-md transition-all text-xs ${
            filter === 'month'
              ? 'bg-red-500 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          This Month
        </button>
      </div>

      {/* Top 3 Podium */}
      {leaderboard.length >= 3 && (
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="text-gray-900 mb-3 text-sm">🏆 Top Performers</h3>
          <div className="flex items-end justify-center gap-2 mb-4">
            {/* 2nd Place */}
            <div className="flex-1 text-center">
              <div className={`${getRankBadge(2)} rounded-lg p-3 mb-1.5`}>
                <div className="w-10 h-10 bg-white rounded-full mx-auto mb-1.5 flex items-center justify-center">
                  <Medal className="text-gray-400" size={20} />
                </div>
                <p className="text-white truncate text-xs">{leaderboard[1].name}</p>
                <p className="text-white/90 text-xs">{leaderboard[1].points} pts</p>
              </div>
              <div className="bg-gray-200 h-16 rounded-t-lg"></div>
            </div>

            {/* 1st Place */}
            <div className="flex-1 text-center">
              <div className={`${getRankBadge(1)} rounded-lg p-3 mb-1.5`}>
                <div className="w-12 h-12 bg-white rounded-full mx-auto mb-1.5 flex items-center justify-center">
                  <Crown className="text-yellow-500" size={24} />
                </div>
                <p className="text-white truncate text-xs">{leaderboard[0].name}</p>
                <p className="text-white/90 text-xs">{leaderboard[0].points} pts</p>
              </div>
              <div className="bg-gradient-to-t from-yellow-400 to-yellow-500 h-20 rounded-t-lg"></div>
            </div>

            {/* 3rd Place */}
            <div className="flex-1 text-center">
              <div className={`${getRankBadge(3)} rounded-lg p-3 mb-1.5`}>
                <div className="w-10 h-10 bg-white rounded-full mx-auto mb-1.5 flex items-center justify-center">
                  <Medal className="text-orange-600" size={20} />
                </div>
                <p className="text-white truncate text-xs">{leaderboard[2].name}</p>
                <p className="text-white/90 text-xs">{leaderboard[2].points} pts</p>
              </div>
              <div className="bg-orange-300 h-12 rounded-t-lg"></div>
            </div>
          </div>
        </div>
      )}

      {/* Full Leaderboard List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-3 border-b border-gray-200 bg-gray-50">
          <h3 className="text-gray-900 text-sm">Rankings</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {leaderboard.map((entry) => (
            <div
              key={entry.rank}
              className={`p-3 transition-colors ${
                entry.isCurrentUser
                  ? 'bg-red-50 border-l-4 border-red-500'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Rank */}
                <div className="w-10 flex items-center justify-center">
                  {entry.rank <= 3 ? (
                    getRankIcon(entry.rank)
                  ) : (
                    <span className="text-gray-600 text-sm">#{entry.rank}</span>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <p className={`${entry.isCurrentUser ? 'text-red-700' : 'text-gray-900'} text-sm truncate`}>
                    {entry.name} {entry.isCurrentUser && '(You)'}
                  </p>
                  <div className="flex gap-2 text-xs text-gray-600 mt-0.5">
                    <span>{entry.journeys} trips</span>
                    <span>•</span>
                    <span>{entry.emissionsSaved.toFixed(1)} kg</span>
                  </div>
                </div>

                {/* Points */}
                <div className="text-right">
                  <p className={`${entry.isCurrentUser ? 'text-red-600' : 'text-gray-900'} text-sm`}>
                    {entry.points}
                  </p>
                  <p className="text-gray-600 text-xs">points</p>
                </div>

                {/* Trend Indicator */}
                {entry.rank <= 10 && (
                  <div className="w-6">
                    <TrendingUp className="text-blue-500" size={16} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Challenge Card */}
      <div className="bg-gradient-to-br from-red-100 to-blue-100 rounded-lg p-4">
        <h3 className="text-gray-900 mb-1.5 text-sm">💪 Weekly Challenge</h3>
        <p className="text-gray-700 mb-3 text-xs">
          Log 5 sustainable journeys this week to earn a bonus 100 points and a special badge!
        </p>
        <div className="bg-white rounded-lg p-2.5">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-gray-700 text-xs">Progress</span>
            <span className="text-red-600 text-xs">
              {userData.journeys.filter((j: any) => {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return new Date(j.date) > weekAgo;
              }).length} / 5
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-gradient-to-r from-red-500 to-blue-600 h-1.5 rounded-full transition-all"
              style={{ 
                width: `${Math.min((userData.journeys.filter((j: any) => {
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return new Date(j.date) > weekAgo;
                }).length / 5) * 100, 100)}%` 
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}